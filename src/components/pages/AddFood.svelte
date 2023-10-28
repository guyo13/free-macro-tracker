<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  import Button from "flowbite-svelte/Button.svelte";
  import ButtonGroup from "flowbite-svelte/ButtonGroup.svelte";
  import Input from "flowbite-svelte/Input.svelte";
  import Label from "flowbite-svelte/Label.svelte";

  const TEXT = {
    save: "Save",
    showMore: "Show More",
    showLess: "Show Less",
    addFood: "Add Food",
    nutritionalFacts: "Nutritional Facts",
    name: "Name",
    brand: "Brand",
    serving: "Serving",
    calories: "Calories",
    proteins: "Proteins",
    carbohydrates: "Carbohydrates",
    fats: "Fats",
    micronutrients: "Micronutrients",
  };
</script>

<div id="add-food-screen" class="fmt-dynamic-screen container-fluid">
  <div id="add-food-screen-alerts" class="row justify-content-center" />
  <div class="container max-w-5xl">
    <!-- Heading -->
    <div class="flex mb-3 justify-between mt-3">
      <span class="fmt-font-2">Add Food</span>
      <button id="add-food-screen-cancel" class="fal fa-times btn fmt-text-btn1" type="button" />
    </div>
    <!-- Content -->
    <div class="flex flex-col overflow-y-auto overflow-x-hidden">
      <Label for="add-food-screen-food-name">{TEXT.name}</Label>
      <Input id="add-food-screen-food-name" size="sm" placeholder="{TEXT.name}" required />
      <Label for="add-food-screen-food-brand">{TEXT.brand}</Label>
      <Input id="add-food-screen-food-brand" size="sm" placeholder="{TEXT.brand}" required />
      <Label for="add-food-screen-food-serving-input">{TEXT.serving}</Label>
      <Input id="add-food-screen-food-serving-input" size="sm" placeholder="{TEXT.serving}" type="number" step="any"
             required />
      <h4 class="text-2xl font-light mt-3">{TEXT.nutritionalFacts}</h4>
      <Label for="add-food-screen-food-calories">{TEXT.calories}</Label>
      <Input id="add-food-screen-food-calories" size="sm" placeholder="{TEXT.calories}" type="number" step="any"
             required />
      <Label for="add-food-screen-food-proteins">{TEXT.proteins}</Label>
      <Input id="add-food-screen-food-proteins" size="sm" placeholder="{TEXT.proteins}" type="number" step="any"
             required />
      <Label for="add-food-screen-food-carbohydrates">{TEXT.carbohydrates}</Label>
      <Input id="add-food-screen-food-carbohydrates" size="sm" placeholder="{TEXT.carbohydrates}" type="number"
             step="any" required />
      <Label for="add-food-screen-food-fats">{TEXT.fats}</Label>
      <Input id="add-food-screen-food-fats" size="sm" placeholder="{TEXT.fats}" type="number" step="any" required />

      <div id="add-food-screen-food-microes" class="flex flex-col">
        <h4 class="text-2xl font-light mt-3">{TEXT.micronutrients}</h4>
        <div id="add-food-screen-food-additional" />
      </div>

      <ButtonGroup id="add-food-screen-footer" class="justify-center space-x-px">
        <Button outline color="dark" id="add-food-screen-more" class="w-40">{TEXT.showMore}</Button>
        <!--                <Button id="add-food-screen-less" class="hidden" outline color="dark">{TEXT.showLess}</Button>-->
        <Button color="blue" id="add-food-screen-save" class="w-40">{TEXT.save}</Button>
      </ButtonGroup>
    </div>
  </div>
</div>
