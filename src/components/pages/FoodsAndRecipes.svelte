<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  import Button from "flowbite-svelte/Button.svelte";
  // TODO - Add the type of consumable to add as an argument
  export let onAddClick: () => void = () => {};
</script>

<div id="foods" class="fmt-tab container-fluid">
  <div id="foods-alerts" class="row justify-content-center" />
  <div class="row justify-content-center fmt-flex-1 mt-3">
    <div class="d-flex col-12 col-lg-8 justify-content-between mb-1">
      <div class="fmt-flex-4">
        <h4 class="fmt-font-2">Foods and Recipes</h4>
      </div>
      <div class="fmt-flex-1 fmt-right-text" style="cursor: pointer;">
        <Button
          color="green"
          on:click={onAddClick}
          id="foods-add"
          action="food"
          class="fa fa-light fa-plus btn fmt-text-btn1 flex-fill fmt-btn-no-focus fmt-text-color-light-green"
          type="button"
        />
      </div>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-12 col-lg-8 mb-1 mt-1">
      <ul id="foods-toggles" class="fmt-tab-ul">
        <li
          id="foods-my-food-btn"
          class="d-inline-block fmt-center-text fmt-tab-li-left fmt-tab-li-active"
        >
          My Foods
        </li>
        <li
          id="foods-my-recipe-btn"
          class="d-inline-block fmt-center-text fmt-tab-li-right"
        >
          My Recipes
        </li>
      </ul>
    </div>
    <div
      id="foods-food-search-cont"
      class="input-group col-12 col-lg-8 mb-1 mt-1"
    >
      <div class="input-group-prepend fmt-w-inherit">
        <input
          id="foods-food-search"
          type="text"
          class="form-control fmt-search-bar"
          placeholder="&#xf002;"
          aria-label="Search"
          aria-describedby="basic-addon2"
        />
      </div>
    </div>
    <div id="foods-food-table-cont" class="input-group col-12 col-lg-8 mb-1">
      <table id="foods-food-table" class="table-striped table-hover table">
        <tbody id="foods-food-table-body" />
      </table>
    </div>
    <div
      id="foods-recipe-search-cont"
      class="input-group col-12 col-lg-8 d-none mb-1 mt-1"
    >
      <div class="input-group-prepend fmt-w-inherit">
        <input
          id="foods-recipe-search"
          type="text"
          class="form-control fmt-search-bar"
          placeholder="&#xf002;"
          aria-label="Search"
          aria-describedby="basic-addon2"
        />
      </div>
    </div>
    <div
      id="foods-recipe-table-cont"
      class="input-group col-12 col-lg-8 d-none mb-1"
    >
      <table id="foods-recipe-table" class="table-striped table-hover table">
        <tbody id="foods-recipe-table-body" />
      </table>
    </div>
  </div>
</div>
