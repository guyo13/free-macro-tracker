<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  import Overlay from "./Overlay.svelte";
</script>

<!-- TODO - Redesign the splash screen to the same look and feel as in the mobile app -->
<Overlay id="fmt-app-load-overlay">
  <div class="flex-column flex h-full items-center justify-center">
    <span class="fmt-bold fmt-loading-screen-font">Free</span>
    <span class="fmt-loading-screen-font-responsive">Macro Tracker</span>
  </div>
</Overlay>

<style></style>
