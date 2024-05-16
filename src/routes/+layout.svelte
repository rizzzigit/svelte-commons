<script lang="ts">
  import ColorScheme from '$lib/color-scheme.svelte';
import { type Snippet } from 'svelte'

  const { children }: {children: Snippet} = $props()
</script>

<ColorScheme/>

{@render children()}
