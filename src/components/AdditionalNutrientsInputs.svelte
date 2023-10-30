<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  import type { INutrientDefinition } from "../models/nutrient";
  import UnitInput from "./UnitInput.svelte";
  import type { INutrientRecord } from "../models/nutrient";

  export let additionalNutrients: Map<string, INutrientDefinition[]>;
  export let additionalNutrientsValues: Map<
    string,
    Map<string, INutrientRecord>
  >;
  export let unitOptions: { name: string; value: string }[];
  export let onMicronutrientChange: (
    amount: string,
    unit: string,
    nutrient: INutrientDefinition
  ) => void | undefined = undefined;
  export let selectPlaceholder: string = "";
</script>

<div>
  {#each additionalNutrients?.entries() ?? [] as category (category[0])}
    <h3 class="font-weight-normal mb-3 mt-3 text-xl">{category[0]}</h3>
    {#each category[1] as nutrient (nutrient.name)}
      <UnitInput
        label={nutrient.name}
        placeholder={nutrient.name}
        {selectPlaceholder}
        {unitOptions}
        onChange={(amount, unit) =>
          onMicronutrientChange?.(amount, unit, nutrient)}
        value={additionalNutrientsValues
          .get(nutrient.category)
          ?.get(nutrient.name)
          ?.amount.toString()}
        selectedUnit={additionalNutrientsValues
          .get(nutrient.category)
          ?.get(nutrient.name)?.unit ?? nutrient.default_unit}
        {...$$restProps}
      />
    {/each}
  {/each}
</div>
