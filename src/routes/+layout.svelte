<script lang="ts">
  import ColorScheme from '$lib/color-scheme.svelte';
  import ResetCSS from '$lib/reset-css.svelte'

  import { type Snippet } from 'svelte'
  import "@fortawesome/fontawesome-free/css/all.min.css";

  const { children }: {children: Snippet} = $props()
</script>

<ColorScheme/>
<ResetCSS />

{@render children()}

<style lang="scss">

</style>
