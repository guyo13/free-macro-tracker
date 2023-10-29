<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  import Select from "flowbite-svelte/Select.svelte";
  import Helper from "flowbite-svelte/Helper.svelte";
  import InputField from "./InputField.svelte";

  export let id: string;
  export let label: string;
  export let value: string;
  export let placeholder: string = "";
  export let unitOptions;
  export let selectPlaceholder: string;
  export let selectedUnit: string;
  export let error: string = "";
  export let selectError: string = "";
  export let onChange: (amount: string, unit: string) => void | undefined =
    undefined;
  $: _error = `${error}${error ? ` ${selectError}` : selectError}`;

  function handleValueChange(event) {
    onChange?.(event.target.value, selectedUnit);
  }

  function handleUnitChange(event) {
    onChange?.(value, event.target.value);
  }
</script>

<div class="flex">
  <InputField
    {id}
    {label}
    bind:value
    {placeholder}
    {...$$restProps}
    containerClass="md:w-1/2 w-9/12"
    onChange={handleValueChange}
    type="number"
    step="any"
  />
  <Select
    class="w-3/12 text-xs md:w-1/2 md:text-base"
    items={unitOptions}
    placeholder={selectPlaceholder}
    bind:value={selectedUnit}
    on:change={handleUnitChange}
  />
</div>
{#if _error}
  <Helper class="mt-1" color="red"
    ><span class="font-medium">{_error}</span></Helper
  >
{/if}
