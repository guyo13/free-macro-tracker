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
