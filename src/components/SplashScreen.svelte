<script lang="ts">
  import Overlay from "./Overlay.svelte";
</script>

<!-- TODO - Redesign the splash screen to the same look and feel as in the mobile app -->
<Overlay id="fmt-app-load-overlay">
  <div
    id="fmt-app-load-overlay-content"
    class="row justify-content-center fmt-center-text fmt-loading-screen-position"
  >
    <div class="col-12">
      <span class="fmt-bold fmt-loading-screen-font">Free</span>
    </div>
    <div class="col-12">
      <span class="fmt-loading-screen-font-responsive">Macro Tracker</span>
    </div>
    <div class="col-12 mb-3 d-none">
      <span class="fmt-loading-screen-logo">Logo</span>
    </div>
    <div id="fmt-app-load-overlay-spinner" class="col-12 d-none">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div
      id="fmt-app-load-overlay-alerts"
      class="row justify-content-center d-none"
    />
  </div>
</Overlay>

<style></style>
