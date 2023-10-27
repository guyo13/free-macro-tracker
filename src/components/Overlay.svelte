<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  // TODO - Remove
  export let id = "";
</script>

<div class="overlay container-fluid" {id}>
  <slot />
</div>

<style>
  .overlay {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
    z-index: 3000;
    overflow: hidden;
    background-color: white;
  }
</style>
