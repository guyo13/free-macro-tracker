<!-- Copyright (c) 2020-2023, Guy Or Please see the AUTHORS file for details.
All rights reserved. Use of this source code is governed by a GNU GPL
license that can be found in the LICENSE file. -->
<script lang="ts">
  import { FMTPlatformType } from "../app/platform";
  import { platformInterface } from "../fmt";
  import Overlay from "./Overlay.svelte";

  export let onSkipProfileClick: () => void;
  export let onCreateProfileClick: () => void;

  let appName =
    platformInterface.platform === FMTPlatformType.IOS ? "Open" : "Free";
</script>

<Overlay id="fmt-app-first-time-overlay">
  <div
    id="fmt-app-first-time-overlay-msg"
    class="row justify-content-center fmt-center-text"
  >
    <div class="fmt-column fmt-page-height fmt-content-center">
      <div class="mb-2">
        <span id="fmt-app-first-time-overlay-text-1" class="">
          {`Welcome to ${appName} Macro Tracker.`}
        </span>
      </div>
      <div class="mb-2">
        <span class="">To get started, let's create your profile.</span>
      </div>
      <div class="mt-2">
        <button
          id="fmt-app-first-time-create"
          class="btn btn-outline-primary"
          type="button"
          on:click={onCreateProfileClick}>Create My Profile</button
        >
      </div>
      <div class="mt-2">
        <span class="">Or</span>
      </div>
      <div class="mt-2">
        <button
          id="fmt-app-first-time-skip"
          class="btn btn-outline-primary"
          type="button"
          on:click={onSkipProfileClick}>Start Without a Profile</button
        >
      </div>
    </div>
  </div>
</Overlay>
