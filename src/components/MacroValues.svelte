<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  export let calories: string = "";
  export let carbs: string = "";
  export let proteins: string = "";
  export let fats: string = "";

  const TEXTS = {
    calories: "Calories",
    carbs: "Carbs",
    proteins: "Proteins",
    fats: "Fats",
  };
</script>

<div class="grid grid-cols-4 justify-items-center">
  <span class="fmt-font-color-primary">{TEXTS.calories}</span>
  <span class="fmt-font-color-violet">{TEXTS.carbs}</span>
  <span class="fmt-font-color-info">{TEXTS.proteins}</span>
  <span class="fmt-font-color-orange">{TEXTS.fats}</span>
  <!--TODO - Remove ids-->
  <span id="view-food-screen-food-calories" class="fmt-font-color-primary"
    >{calories}</span
  >
  <span id="view-food-screen-food-carbohydrates" class="fmt-font-color-violet"
    >{carbs}</span
  >
  <span id="view-food-screen-food-proteins" class="fmt-font-color-info"
    >{proteins}</span
  >
  <span id="view-food-screen-food-fats" class="fmt-font-color-orange"
    >{fats}</span
  >
</div>
