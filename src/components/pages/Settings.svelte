<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  import Button from "flowbite-svelte/Button.svelte";
  import ButtonGroup from "flowbite-svelte/ButtonGroup.svelte";
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

  const TEXTS = {
    settings: "Settings",
    importAndExport: "Import and Export",
    export: "Export Your Data",
    import: "Import JSON File",
  };

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
      <Button id="settings-data-control-export">
        <i class="fa fa-light fa-download mr-2" />
        {TEXTS.export}
      </Button>
      <Button id="settings-data-control-import">
        <i class="fa fa-light fa-file-upload mr-2" />
        {TEXTS.import}
      </Button>
    </ButtonGroup>

    <div
      id="settings-data-control-import-indiv"
      class="input-group col-12 col-lg-8 d-none mb-1"
    >
      <div class="input-group mb-3 mt-3">
        <div class="custom-file">
          <input
            id="settings-data-control-import-file"
            class="custom-file-input"
            type="file"
            accept="application/json"
          />
          <label
            id="settings-data-control-import-file-label"
            class="custom-file-label"
            for="settings-data-control-import-file">Choose file to Import</label
          >
        </div>
      </div>
    </div>
  </div>
</div>

<style>
</style>
