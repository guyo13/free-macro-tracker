<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  import Button from "flowbite-svelte/Button.svelte";
  import ButtonGroup from "flowbite-svelte/ButtonGroup.svelte";
  import Fileupload from "flowbite-svelte/Fileupload.svelte";
  import { onMount } from "svelte";
  import repositoriesProvider from "../../db/repositoriesProvider";
  import unitRepositoryProvider, {
    type IUnitRepository,
  } from "../../db/unitRepository";
  import nutrientRepositoryProvider, {
    type INutrientRepository,
  } from "../../db/nutrientRepository";
  import profileRepositoryProvider, {
    type IProfileRepository,
  } from "../../db/profileRepository";
  import foodRepositoryProvider, {
    type IFoodRepository,
  } from "../../db/foodRepository";
  import userGoalsRepositoryProvider, {
    type IUserGoalsRepository,
  } from "../../db/userGoalsRepository";
  import { type IExportService } from "../../db/exportService";
  import ExportService from "../../db/exportService";
  import {
    fmtAppExport,
    FMTDataToStructuredJSON,
    FMTExportToJSON,
    FMTImportFromStructuredJSON,
    FMTShowAlert,
    FMTShowPrompt,
    platformInterface,
  } from "../../fmt";

  const TEXTS = {
    settings: "Settings",
    importAndExport: "Import and Export",
    export: "Export Your Data",
    import: "Import JSON File",
  };

  let showFileUploader = false;
  let exportService: IExportService;
  onMount(() => {
    return repositoriesProvider
      .synced([
        unitRepositoryProvider,
        nutrientRepositoryProvider,
        profileRepositoryProvider,
        foodRepositoryProvider,
        userGoalsRepositoryProvider,
      ])
      .subscribe(async (repositories) => {
        if (!repositories) return;
        const [
          unitRepository,
          nutrientRepository,
          profileRepository,
          foodRepository,
          userGoalsRepository,
        ] = repositories as [
          IUnitRepository,
          INutrientRepository,
          IProfileRepository,
          IFoodRepository,
          IUserGoalsRepository,
        ];

        exportService = new ExportService(
          unitRepository,
          nutrientRepository,
          profileRepository,
          foodRepository,
          userGoalsRepository
        );
      });
  });

  function handleExportClick() {
    const d = new Date();
    const fileName = `FMT_Data_export_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
    FMTDataToStructuredJSON(function (records) {
      FMTExportToJSON(
        records,
        function () {
          const link = document.createElement("a");
          link.setAttribute("download", fileName);
          link.href = fmtAppExport;
          link.click();
        },
        null,
        fileName
      );
    });
  }

  function handleImportClick() {
    if (platformInterface.hasPlatformInterface) {
      // This initiates the import process on the platform
      // When the user proceeds with selecting file, the platform will fire
      // [FMTImportData]
      platformInterface.FMTImportData();
    } else {
      showFileUploader = !showFileUploader;
    }
  }

  function handleImport(event) {
    const file = event.target.files[0];
    console.log({ file });
    if (file) {
      // TODO - Refactor
      FMTShowPrompt(
        "settings-alerts",
        "warning",
        "Importing might cause loss of current application data. Are you sure?",
        undefined,
        function (res) {
          if (res) {
            const fileReader = new FileReader();
            fileReader.onloadend = function () {
              FMTImportFromStructuredJSON(fileReader.result);
            };
            fileReader.readAsText(file);
          } else {
            FMTShowAlert(
              "settings-alerts",
              "primary",
              "Import from file aborted!"
            );
          }
        }
      );
    }
  }
</script>

<div id="settings" class="fmt-tab container-fluid">
  <div id="settings-alerts" class="row justify-content-center" />

  <div
    id="settings-data-control"
    class="flex-column container flex h-full max-w-4xl"
  >
    <span class="mb-3 mt-3 text-2xl font-light">{TEXTS.settings}</span>
    <h4 class="mb-2 text-xl font-light">{TEXTS.importAndExport}</h4>
    <ButtonGroup class="w-fit">
      <Button id="settings-data-control-export" on:click={handleExportClick}>
        <i class="fa fa-light fa-download mr-2" />
        {TEXTS.export}
      </Button>
      <Button id="settings-data-control-import" on:click={handleImportClick}>
        <i class="fa fa-light fa-file-upload mr-2" />
        {TEXTS.import}
      </Button>
    </ButtonGroup>
    {#if showFileUploader}
      <Fileupload
        id="settings-data-control-import-file"
        class="mt-3"
        type="file"
        accept="application/json"
        on:change={handleImport}
      />
    {/if}
  </div>
</div>

<style>
</style>
