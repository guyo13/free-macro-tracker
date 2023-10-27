<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  // TODO - Add event handlers
</script>

<div class="container-fluid">
  <!-- TODO remove if not needed-->
  <div
    id="fmt-app-nav-overlay-alerts"
    class="row justify-content-center d-none"
  />
  <div class="row justify-content-between fmt-bg-dark-green navbarPosition">
    <div
      id="goto-overview"
      class="col-3 align-self-center menuItem"
      title="Meals"
    >
      <i class="fal fa-tasks-alt navbarIcon" />
    </div>
    <div
      id="goto-profile"
      class="col-3 align-self-center menuItem"
      title="Profile"
    >
      <i class="fal fa-user navbarIcon" />
    </div>
    <div id="goto-foods" class="col-3 align-self-center menuItem" title="Foods">
      <i class="fal fa-utensils navbarIcon" />
    </div>
    <div
      id="goto-settings"
      class="col-3 align-self-center menuItem"
      title="Settings"
    >
      <i class="fal fa-cog navbarIcon" />
    </div>
  </div>
</div>

<style>
  .menuItem {
    text-align: center;
    font-size: 1.5rem;
    color: var(--fmt-gainsboro);
    cursor: pointer;
    height: inherit;
  }

  .navbarIcon {
    vertical-align: bottom;
  }

  .navbarPosition {
    bottom: 0;
    position: fixed;
    height: 3rem;
    width: 100vw;
    transition: bottom 0.3s;
  }
</style>
