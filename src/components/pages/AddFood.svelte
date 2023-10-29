<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  import Button from "flowbite-svelte/Button.svelte";
  import ButtonGroup from "flowbite-svelte/ButtonGroup.svelte";
  import Modal from "flowbite-svelte/Modal.svelte";
  import UnitInput from "../UnitInput.svelte";
  import InputField from "../InputField.svelte";
  import type { IUnit } from "../../models/units";
  import type {
    AdditionalNutrients,
    INutrientDefinition,
    INutrientRecord,
  } from "../../models/nutrient";
  import { isValidNutritionalValue } from "../../utils/utils";
  import type { IFood } from "../../models/food";
  const EMPTY_FN = () => {};

  export let units: IUnit[];
  export let additionalNutrients: Map<string, INutrientDefinition[]>;
  export let onClose: () => void = EMPTY_FN;
  export let onSave: (data: IFood) => void = EMPTY_FN;

  const TEXT = {
    basicInfo: "Basic Information",
    save: "Save",
    addFood: "Add Food",
    nutritionalFacts: "Nutritional Facts",
    name: "Name",
    brand: "Brand",
    serving: "Serving",
    select: "Select",
    calories: "Calories",
    proteins: "Proteins",
    carbohydrates: "Carbohydrates",
    fats: "Fats",
    micronutrients: "Micronutrients",
    errors: {
      name: "Food name is required.",
      serving: "Serving is required.",
      servingUnit: "Serving unit is required.",
      calories: "Caloric value must be a non-negative number.",
      protein: "Protein content must be a non-negative number.",
      carbs: "Carbohydrate content must be a non-negative number.",
      fats: "Fat content must be a non-negative number.",
    },
  };

  let name: string,
    nameError: string,
    brand: string,
    serving: string,
    servingError: string,
    servingUnitName: string,
    servingUnitNameError: string,
    calories: string,
    caloriesError: string,
    proteins: string,
    proteinsError: string,
    carbs: string,
    carbsError: string,
    fats: string,
    fatsError: string,
    additionalNutrientsValues = new Map<string, Map<string, INutrientRecord>>();
  let alertBeforeDiscardingChanges = false;
  $: hasUnsavedChanges =
    name ||
    brand ||
    serving ||
    servingUnitName ||
    calories ||
    proteins ||
    carbs ||
    fats ||
    additionalNutrientsValues.size > 0;
  $: unitOptions =
    units?.map((unit) => ({
      name: unit.description,
      value: unit.name,
    })) ?? [];
  function handleMicronutrientChange(
    amount: string,
    unit: string,
    nutrient: INutrientDefinition
  ) {
    if (amount.startsWith("-")) return;
    const shouldDelete = !amount;

    let category = additionalNutrientsValues.get(nutrient.category);
    if (!category) {
      category = new Map<string, INutrientRecord>();
      additionalNutrientsValues.set(nutrient.category, category);
    }

    if (shouldDelete) {
      category.delete(nutrient.name);
      if (category.size < 1) {
        additionalNutrientsValues.delete(nutrient.category);
      }
    } else {
      let nutrientRecord = category.get(nutrient.name) ?? {
        name: nutrient.name,
        unit,
        amount: Number(amount),
      };
      nutrientRecord.unit = unit;
      nutrientRecord.amount = Number(amount);
      category.set(nutrient.name, nutrientRecord);
    }
  }

  function validate() {
    nameError = name ? "" : TEXT.errors.name;
    servingError = serving ? "" : TEXT.errors.serving;
    servingUnitNameError = servingUnitName ? "" : TEXT.errors.servingUnit;
    caloriesError =
      calories && isValidNutritionalValue(calories) ? "" : TEXT.errors.calories;
    proteinsError =
      proteins && isValidNutritionalValue(proteins) ? "" : TEXT.errors.protein;
    carbsError =
      carbs && isValidNutritionalValue(carbs) ? "" : TEXT.errors.carbs;
    fatsError = fats && isValidNutritionalValue(fats) ? "" : TEXT.errors.fats;

    return !(
      nameError ||
      servingError ||
      servingUnitNameError ||
      caloriesError ||
      proteinsError ||
      carbsError ||
      fatsError
    );
  }

  function handleClose() {
    if (hasUnsavedChanges) {
      alertBeforeDiscardingChanges = true;
    } else {
      onClose();
    }
  }

  function handleCancelClose() {
    alertBeforeDiscardingChanges = false;
  }

  function handleSave() {
    if (validate()) {
      const additionalNutrients = {} satisfies AdditionalNutrients;
      for (const [
        categoryName,
        categoryRecords,
      ] of additionalNutrientsValues.entries()) {
        additionalNutrients[categoryName] = Array.from(
          categoryRecords.values()
        );
      }

      onSave({
        name,
        brand,
        type: 1,
        referenceServing: parseFloat(serving),
        units: servingUnitName,
        nutritionalValue: {
          calories: parseFloat(calories),
          proteins: parseFloat(proteins),
          carbohydrates: parseFloat(carbs),
          fats: parseFloat(fats),
          additionalNutrients,
        },
      } satisfies IFood);
    }
  }
</script>

<!--TODO - Refactor with a dialog wrapper that supports platform interface-->
<Modal bind:open={alertBeforeDiscardingChanges} size="xs">
  <p>Unsaved changes will be discarded.</p>
  <ButtonGroup slot="footer">
    <Button on:click={onClose} color="red" outline>Confirm</Button>
    <Button on:click={handleCancelClose}>Cancel</Button>
  </ButtonGroup>
</Modal>
<div id="add-food-screen" class="fmt-dynamic-screen container-fluid">
  <div id="add-food-screen-alerts" class="row justify-content-center"></div>
  <div class="container flex h-full max-w-4xl flex-col">
    <!-- Heading -->
    <div class="mb-3 mt-3 flex justify-between">
      <span class="fmt-font-2">Add Food</span>
      <Button
        class="fa fa-light fa-times btn fmt-text-btn1"
        color="red"
        on:click={handleClose}
      />
    </div>
    <!-- Content -->
    <div class="flex flex-col overflow-y-auto">
      <h4 class="mt-3 border-solid border-t-neutral-300 text-2xl font-light">
        {TEXT.basicInfo}
      </h4>
      <InputField
        id="add-food-screen-food-name"
        label={TEXT.name}
        placeholder={TEXT.name}
        required
        bind:value={name}
        error={nameError}
      />
      <InputField
        id="add-food-screen-food-brand"
        label={TEXT.brand}
        placeholder={TEXT.brand}
        bind:value={brand}
      />
      <UnitInput
        id="add-food-screen-food-serving-input"
        label={TEXT.serving}
        placeholder={TEXT.serving}
        selectPlaceholder={TEXT.select}
        {unitOptions}
        bind:value={serving}
        bind:selectedUnit={servingUnitName}
        required
        error={servingError}
        selectError={servingUnitNameError}
      />
      <h4 class="mt-3 text-2xl font-light">{TEXT.nutritionalFacts}</h4>
      <InputField
        id="add-food-screen-food-calories"
        label={TEXT.calories}
        placeholder={TEXT.calories}
        type="number"
        step="any"
        required
        bind:value={calories}
        error={caloriesError}
      />
      <InputField
        id="add-food-screen-food-proteins"
        label={TEXT.proteins}
        placeholder={TEXT.proteins}
        type="number"
        step="any"
        required
        bind:value={proteins}
        error={proteinsError}
      />
      <InputField
        id="add-food-screen-food-carbohydrates"
        label={TEXT.carbohydrates}
        placeholder={TEXT.carbohydrates}
        type="number"
        step="any"
        required
        bind:value={carbs}
        error={carbsError}
      />
      <InputField
        id="add-food-screen-food-fats"
        label={TEXT.fats}
        placeholder={TEXT.fats}
        type="number"
        step="any"
        required
        bind:value={fats}
        error={fatsError}
      />
      <h4 class="mt-3 text-2xl font-light">{TEXT.micronutrients}</h4>
      <!--TODO - Extract to separate component-->
      <div id="add-food-screen-food-additional">
        {#each additionalNutrients?.entries() ?? [] as category (category[0])}
          <h3 class="font-weight-normal mb-3 mt-3 text-xl">{category[0]}</h3>
          {#each category[1] as nutrient (nutrient.name)}
            <UnitInput
              id={`add-food-screen-food-${category[0]}-${nutrient.name}}`}
              label={nutrient.name}
              placeholder={nutrient.name}
              selectPlaceholder={TEXT.select}
              {unitOptions}
              onChange={(amount, unit) =>
                handleMicronutrientChange(amount, unit, nutrient)}
              value={additionalNutrientsValues
                .get(nutrient.category)
                ?.get(nutrient.name)
                ?.amount.toString()}
              selectedUnit={additionalNutrientsValues
                .get(nutrient.category)
                ?.get(nutrient.name)?.unit ?? nutrient.default_unit}
            />
          {/each}
        {/each}
      </div>
    </div>
    <!-- Footer -->
    <ButtonGroup
      id="add-food-screen-footer"
      class="mt-auto justify-center space-x-px py-3"
    >
      <Button
        color="blue"
        id="add-food-screen-save"
        class="w-40"
        on:click={handleSave}>{TEXT.save}</Button
      >
    </ButtonGroup>
  </div>
</div>
