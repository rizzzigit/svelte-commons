<script lang="ts" context="module">
  export enum ButtonClass {
    Primary = "primary",
    PrimaryContainer = "primary-container",
    Background = "background",
    BackgroundVariant = "background-variant",
  }

  export type ButtonCallback = (event: MouseEvent) => Promise<void> | void;
</script>

<script lang="ts">
  import{ type Snippet } from 'svelte'
  import Awaiter, { AwaiterResultType, type AwaiterChildrenParameters, type AwaiterResetFunction } from "$lib/awaiter.svelte";

  import LoadingSpinner from "./loading-spinner.svelte";

  const {
    buttonClass = ButtonClass.Primary,
    enabled = true,
    outline = true,
    onClick,
    hint = null,
    children
  }: {
    children: Snippet,
    buttonClass?: ButtonClass,
    enabled?: boolean,
    outline?: boolean,
    onClick: ButtonCallback,
    hint?: string | null,
  } = $props();

  let busy: boolean = $state(false);
  let run: AwaiterResetFunction<null> | undefined = $state();

  let event: MouseEvent | null = null;

  async function click(newEvent: MouseEvent) {
    try {
      event = newEvent
      busy = true;

      await run?.(true, null);
    } finally {
      event = null
      busy = false;
    }
  }
</script>

{#snippet buttonContent(props: AwaiterChildrenParameters<void, null>)}
  {#if props.status === AwaiterResultType.Loading}
    <LoadingSpinner size="1em" />
  {:else}
    {@render children()}
  {/if}
{/snippet}

<button
  disabled={!enabled || busy}
  class="button {buttonClass}{outline ? ' outline' : ''}"
  onclick={click}
  title={hint}
>
  <Awaiter bind:reset={run} children={buttonContent} callback={() => onClick(event!)} autoLoad={false} />
</button>

<style lang="scss">
  button.button {
    // padding: 8px 16px 8px 16px;

    box-sizing: border-box;
    transition: all linear 150ms;

    border: solid 1px transparent;
    border-radius: 8px;

    cursor: pointer;
  }

  button.button.outline {
    border-color: var(--primary);
  }

  button.primary {
    background-color: var(--primary);
    color: var(--onPrimary);
  }

  button.primary:hover {
    background-color: var(--primaryVariant);
    color: var(--onPrimaryVariant);
  }

  button.primary:active {
    background-color: var(--onPrimary);
  }

  button.primary-container {
    background-color: var(--primaryContainer);
    color: var(--onPrimaryContainer);
  }

  button.primary-container:hover {
    background-color: var(--primaryContainerVariant);
    color: var(--onPrimaryContainer);
  }

  button.primary-container:active {
    background-color: var(--onPrimaryContainer);
    color: var(--onPrimary);
  }

  button.background {
    background-color: var(--background);
    color: var(--onBackground);
  }

  button.background:hover {
    background-color: var(--backgroundVariant);
    color: var(--onBackground);
  }

  button.background:active {
    background-color: var(--onBackground);
    color: var(--background);
  }

  button.background-variant {
    background-color: var(--backgroundVariant);
    color: var(--onBackground);
  }

  button.background-variant:hover {
    background-color: var(--background);
    color: var(--onBackground);
  }

  button.background-variant:active {
    background-color: var(--onBackground);
    color: var(--backgroundVariant);
  }

  button:disabled {
    cursor: not-allowed;
  }

  button:disabled.primary {
    background-color: var(--primary);
    color: var(--onPrimary);
  }

  button:disabled.primary-container {
    background-color: var(--primaryContainer);
    color: var(--onPrimaryContainer);
  }

  button:disabled.background {
    background-color: var(--background);
    color: var(--onBackground);
  }
</style>
