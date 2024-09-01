<script lang="ts" module>
	import { viewMode, ViewMode } from "./types.js";

  import { get, writable, type Writable } from "svelte/store";

  function onResize() {
    let newViewMode: ViewMode = ViewMode.Unset;

    newViewMode |= window.matchMedia("(max-width: 768px)").matches
      ? ViewMode.Mobile
      : ViewMode.Desktop;

    newViewMode |= window.matchMedia("(display-mode: minimal-ui)").matches
      ? ViewMode.MinimalUI
      : window.matchMedia("(display-mode: window-controls-overlay)").matches
        ? ViewMode.OverlayControls
        : window.matchMedia("(display-mode: standalone)").matches
          ? ViewMode.Standalone
          : ViewMode.Browser;

    if (newViewMode != get(viewMode)) {
      viewMode.set(newViewMode);
    }
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";

  onMount(() => onResize());
</script>

<svelte:window onresize={onResize} />
