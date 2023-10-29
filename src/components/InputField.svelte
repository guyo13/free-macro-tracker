<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  import ButtonGroup from "flowbite-svelte/ButtonGroup.svelte";
  import Input from "flowbite-svelte/Input.svelte";
  import InputAddon from "flowbite-svelte/InputAddon.svelte";
  import Helper from "flowbite-svelte/Helper.svelte";

  export let label: string,
    placeholder: string,
    value: string,
    containerClass: string = "",
    addonClass: string = "",
    inputGroupClass: string = "w-full",
    size: string = "sm",
    error: string = "";
  export let onChange: (event) => void | undefined = undefined;

  $: _addonClass = `${addonClass} text-xs md:text-base`;
  $: _inputClass = `${$$props.class} text-xs md:text-base`;
</script>

<div class={containerClass}>
  <ButtonGroup class={inputGroupClass}>
    <InputAddon class={_addonClass}><span>{label}</span></InputAddon>
    <Input
      {size}
      {placeholder}
      bind:value
      {...$$restProps}
      class={_inputClass}
      on:change={onChange}
      on:input={onChange}
    />
  </ButtonGroup>
  {#if error}
    <Helper class="mt-1" color="red"
      ><span class="font-medium">{error}</span></Helper
    >
  {/if}
</div>
