<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
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
    class="row justify-content-center align-items-center fmt-bg-gainsboro pb-1 pt-1"
  >
    <div class="col-12 col-lg-8 ml-1">
      <h4 class="fmt-font-2 mb-0">Settings</h4>
    </div>
  </div>
  <div id="settings-data-control" class="row justify-content-center mt-4">
    <div class="col-12 col-lg-8 mb-4">
      <h4 class="fmt-font-1-5 mb-0">Import and Export</h4>
    </div>
    <div class="col-12 col-lg-8 mb-1">
      <div
        id="settings-data-control-export"
        class="fmt-list-tile fmt-bg-cultured"
      >
        <span
          class="fmt-list-tile-body btn fmt-btn-outline-dark-green d-inline-block"
          >Export Your Data
        </span>
        <span class="fa fa-light fa-download btn fmt-list-tile-trailing" />
      </div>
    </div>
    <div class="col-12 col-lg-8 mb-1">
      <div
        id="settings-data-control-import"
        class="fmt-list-tile fmt-bg-cultured"
      >
        <span
          class="fmt-list-tile-body btn fmt-btn-outline-dark-green d-inline-block"
          >Import JSON File
        </span>
        <span class="fa fa-light fa-file-upload btn fmt-list-tile-trailing" />
      </div>
    </div>
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
