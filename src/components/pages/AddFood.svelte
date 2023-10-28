<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  import Button from "flowbite-svelte/Button.svelte";
  import ButtonGroup from "flowbite-svelte/ButtonGroup.svelte";
  import Input from "flowbite-svelte/Input.svelte";
  import Label from "flowbite-svelte/Label.svelte";
  import Select from "flowbite-svelte/Select.svelte";

  const TEXT = {
    save: "Save",
    showMore: "Show More",
    showLess: "Show Less",
    addFood: "Add Food",
    nutritionalFacts: "Nutritional Facts",
    name: "Name",
    brand: "Brand",
    serving: "Serving",
    chooseUnits: "Choose units",
    calories: "Calories",
    proteins: "Proteins",
    carbohydrates: "Carbohydrates",
    fats: "Fats",
    micronutrients: "Micronutrients",
  };

  let name: string, brand: string, serving: string, calories: string, proteins: string, carbs: string, fats: string;
  let isShowingMicros = false;
  $: expandCollapseText = isShowingMicros ? TEXT.showLess : TEXT.showMore;

  function handleSave() {
    console.log({ name, brand, serving, calories, proteins, carbs, fats });
  }

  function handleExpandOrCollapse() {
    isShowingMicros = !isShowingMicros;
  }
</script>

<div id="add-food-screen" class="fmt-dynamic-screen container-fluid">
  <div id="add-food-screen-alerts" class="row justify-content-center" />
  <div class="container flex flex-col max-w-4xl h-full">
    <!-- Heading -->
    <div class="flex mb-3 justify-between mt-3">
      <span class="fmt-font-2">Add Food</span>
      <button id="add-food-screen-cancel" class="fal fa-times btn fmt-text-btn1" type="button" />
    </div>
    <!-- Content -->
    <div class="flex flex-col overflow-y-auto overflow-x-hidden">
      <Label for="add-food-screen-food-name">{TEXT.name}</Label>
      <Input id="add-food-screen-food-name" size="sm" placeholder="{TEXT.name}" required bind:value={name} />
      <Label for="add-food-screen-food-brand">{TEXT.brand}</Label>
      <Input id="add-food-screen-food-brand" size="sm" placeholder="{TEXT.brand}" required bind:value={brand} />
      <Label for="add-food-screen-food-serving-input">{TEXT.serving}</Label>
      <div class="flex">
        <Input id="add-food-screen-food-serving-input" size="sm" placeholder="{TEXT.serving}" type="number" step="any"
               required bind:value={serving} />
        <Select class="w-6/12" items="{[]}" placeholder="{TEXT.chooseUnits}" />
      </div>
      <h4 class="text-2xl font-light mt-3">{TEXT.nutritionalFacts}</h4>
      <Label for="add-food-screen-food-calories">{TEXT.calories}</Label>
      <Input id="add-food-screen-food-calories" size="sm" placeholder="{TEXT.calories}" type="number" step="any"
             required bind:value={calories} />
      <Label for="add-food-screen-food-proteins">{TEXT.proteins}</Label>
      <Input id="add-food-screen-food-proteins" size="sm" placeholder="{TEXT.proteins}" type="number" step="any"
             required bind:value={proteins} />
      <Label for="add-food-screen-food-carbohydrates">{TEXT.carbohydrates}</Label>
      <Input id="add-food-screen-food-carbohydrates" size="sm" placeholder="{TEXT.carbohydrates}" type="number"
             step="any" required bind:value={carbs} />
      <Label for="add-food-screen-food-fats">{TEXT.fats}</Label>
      <Input id="add-food-screen-food-fats" size="sm" placeholder="{TEXT.fats}" type="number" step="any" required
             bind:value={fats} />
      <div id="add-food-screen-food-microes" class="{isShowingMicros ? 'flex flex-col' : 'hidden'}">
        <h4 class="text-2xl font-light mt-3">{TEXT.micronutrients}</h4>
        <div id="add-food-screen-food-additional" />
      </div>
    </div>
    <!-- Footer -->
    <ButtonGroup id="add-food-screen-footer" class="justify-center space-x-px mt-auto">
      <Button outline color="dark" id="add-food-screen-more" class="w-40"
              on:click={handleExpandOrCollapse}>{expandCollapseText}</Button>
      <Button color="blue" id="add-food-screen-save" class="w-40" on:click={handleSave}>{TEXT.save}</Button>
    </ButtonGroup>
  </div>
</div>
