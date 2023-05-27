<script lang="ts">
  // TODO - Remove
  //   export let id = "";
</script>

<div class="container-fluid">
  <!-- TODO remove if not needed-->
  <div
    id="fmt-app-nav-overlay-alerts"
    class="row justify-content-center d-none"
  />
  <div
    class="row justify-content-between fmt-bg-dark-green fmt-navbar-position"
  >
    <div
      id="goto-overview"
      class="col-3 align-self-center menuItem fmt-nav-item-container"
      title="Meals"
    >
      <i class="fal fa-tasks-alt fmt-nav-icon" />
    </div>
    <div
      id="goto-profile"
      class="col-3 align-self-center menuItem fmt-nav-item-container"
      title="Profile"
    >
      <i class="fal fa-user fmt-nav-icon" />
    </div>
    <div
      id="goto-foods"
      class="col-3 align-self-center menuItem fmt-nav-item-container"
      title="Foods"
    >
      <i class="fal fa-utensils fmt-nav-icon" />
    </div>
    <div
      id="goto-settings"
      class="col-3 align-self-center menuItem fmt-nav-item-container"
      title="Settings"
    >
      <i class="fal fa-cog fmt-nav-icon" />
    </div>
  </div>
</div>

<style>
  .menuItem {
    text-align: center;
    font-size: 1.5rem;
    color: var(--fmt-gainsboro);
    cursor: pointer;
  }
</style>
