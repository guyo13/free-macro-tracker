<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  import Button from "flowbite-svelte/Button.svelte";
  import ButtonGroup from "flowbite-svelte/ButtonGroup.svelte";
  import MacroValues from "../MacroValues.svelte";
  import InputField from "../InputField.svelte";
  import UnitInput from "../UnitInput.svelte";
  import type { IUnit } from "../../models/units";
  import { makeUnitOptions } from "../utils/units";
  import AdditionalNutrientsInputs from "../AdditionalNutrientsInputs.svelte";
  import type {
    INutrientDefinition,
    INutrientRecord,
  } from "../../models/nutrient";
  const EMPTY_FN = () => {};

  export let units: IUnit[];
  export let additionalNutrients: Map<string, INutrientDefinition[]>;
  export let onAddClick: () => void = EMPTY_FN;
  export let onEditClick: () => void = EMPTY_FN;

  const TEXTS = {
    viewFood: "View Food",
    basicInfo: "Basic Information",
    date: "Meal date",
    mealName: "Meal name",
    description: "Description",
    brand: "Brand",
    serving: "Serving",
    select: "Select",
    micronutrients: "Micronutrients",
    add: "Add",
    edit: "Edit",
  };

  let addToMealName: string,
    // TODO - take these as props
    addToMealDate: Date,
    addToMealVisible = false,
    serving: string,
    servingError: string,
    servingUnitName: string,
    servingUnitNameError: string,
    additionalNutrientsValues = new Map<string, Map<string, INutrientRecord>>();
  $: unitOptions = makeUnitOptions(units);
  function handleClose() {
    //TODO
  }
</script>

<div id="view-food-screen" class="fmt-dynamic-screen container-fluid">
  <div id="view-food-screen-alerts" class="row justify-content-center" />
  <div class="flex-column container flex h-full max-w-4xl">
    <!-- Heading -->
    <div class="mb-3 mt-3 flex justify-between">
      <span class="text-2xl font-light">{TEXTS.viewFood}</span>
      <Button
        class="fa fa-light fa-times btn fmt-text-btn1"
        color="red"
        on:click={handleClose}
      />
    </div>
    <!-- Content -->
    <div class="flex flex-col overflow-y-auto">
      <!--TODO - Pass values for macros-->
      <MacroValues />
      {#if addToMealVisible}
        <InputField
          label={TEXTS.date}
          addonClass="w-36"
          type="date"
          bind:valueAsDate={addToMealDate}
        />
        <InputField
          label={TEXTS.mealName}
          addonClass="w-36"
          bind:value={addToMealName}
        />
      {/if}
      <h4 class="mt-3 text-2xl font-light">
        {TEXTS.basicInfo}
      </h4>
      <InputField
        id="view-food-screen-food-name"
        label={TEXTS.description}
        required
        disabled
      />
      <InputField
        id="view-food-screen-food-brand"
        label={TEXTS.brand}
        disabled
      />
      <UnitInput
        id="view-food-screen-food-serving-input"
        label={TEXTS.serving}
        placeholder={TEXTS.serving}
        selectPlaceholder={TEXTS.select}
        {unitOptions}
        bind:value={serving}
        bind:selectedUnit={servingUnitName}
        required
        error={servingError}
        selectError={servingUnitNameError}
      />
      <h4 class="mt-3 text-2xl font-light">{TEXTS.micronutrients}</h4>
      <AdditionalNutrientsInputs
        {additionalNutrients}
        {additionalNutrientsValues}
        {unitOptions}
        disabled
      />
    </div>
    <!-- Footer -->
    <ButtonGroup class="mt-auto justify-center space-x-px py-3">
      <Button color="green" class="w-40" on:click={onAddClick}
        >{TEXTS.add}</Button
      >
      <Button color="dark" class="w-40" on:click={onEditClick} outline
        >{TEXTS.edit}</Button
      >
    </ButtonGroup>
  </div>
</div>
