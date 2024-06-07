<script context="module" lang="ts">
  import { writable, type Writable } from "svelte/store";

  export enum InputClass {
    Primary = "primary",
    PrimaryContainer = "primary-container",
    Background = "background",
    Transparent = "transparent",
  }

  export enum InputType {
    Text,
    Password,
    Number,
    Date,
    Time,
    Submit,
    DropDown,
    Radio,
  }

  export type InputOptions<T extends InputType> = ({
    class?: InputClass;
    icon?: string;
    name: string;

    value: Writable<any>;
    tabIndex?: number;
  } & (
    | {
        type: InputType.Text | InputType.Password;
        placeholder?: string;
        value: Writable<string>;
        update?: (value: string) => void;
      }
    | {
        type: InputType.Number;
        placeholder?: string;
        value: Writable<number>;
        update?: (value: number) => void;
      }
  )) & { type: T };
</script>

<script lang="ts" generics="T extends InputType">
  let {
    value,
    focus = $bindable(),
    error,
    onSubmit,
    ...options
  }: InputOptions<T> & {
    focus?: () => void;
    error?: Error;
    onSubmit?: () => void;
  } = $props();

  const icon = options.icon ?? "fa-regular fa-pen-to-square";
  const inputClass = options.class ?? InputClass.Primary;

  let inputElement: Writable<HTMLInputElement | null> = writable(null);

  $effect(
    () =>
      (focus = () => {
        $inputElement?.focus();
      })
  );
</script>

<button
  class="input {inputClass}"
  onclick={(event) => {
    $inputElement?.focus();
  }}
>
  <i class="{icon} icon"></i>
  <div class="field">
    <p class="label">
      {options.name}
      {#if error != null}
        <span>{error.message}</span>
      {/if}
    </p>
    <div class="input">
      <form
        onsubmit={(event) => {
          event.preventDefault();
          onSubmit?.();
        }}
      >
        {#if options.type === InputType.Text || options.type === InputType.Password}
          {@const { placeholder } = options}
          <input
            bind:this={$inputElement}
            type={options.type === InputType.Password ? "password" : "text"}
            {placeholder}
            bind:value={$value}
          />
        {:else if options.type === InputType.Number}
          {@const { placeholder } = options}
          <input
            bind:this={$inputElement}
            type="number"
            {placeholder}
            bind:value={$value}
          />
        {/if}
      </form>
    </div>
  </div>
</button>

<style lang="scss">
  form {
    display: contents;
  }

  button.input {
    cursor: text;

    max-width: 100%;
    min-width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;

    border: solid 1px transparent;

    font-size: inherit;
    font-weight: inherit;

    padding: 4px 8px;
    gap: 8px;
    border-radius: 4px;

    > i.icon {
      width: 16px;
      height: 16px;
    }

    > div.field {
      min-width: 0px;
      flex-grow: 1;

      display: flex;
      flex-direction: column;
      align-items: safe start;
      overflow: hidden;

      > p.label {
        min-width: 100%;
        max-width: 100%;
        font-size: 0.75em;
        text-align: start;

        overflow: hidden;
        text-overflow: ellipsis;
        text-wrap: nowrap;
      }

      > div.input {
        min-width: 100%;
        max-width: 100%;
        flex-grow: 1;

        > form {
          > input {
            min-width: 100%;
            max-width: 100%;
            min-height: 100%;
            box-sizing: border-box;

            background-color: inherit;
            color: inherit;

            outline: none;
            border: none;
            border-bottom: solid 1px transparent;

            font-size: inherit;
            font-weight: inherit;
          }

          > input:focus {
            border-bottom-color: var(--onBackground);
          }

          > input:autofill {
            background-color: inherit;
          }
        }
      }
    }
  }

  button.input {
    background-color: var(--backgroundVariant);
    color: var(--onBackgroundVariant);
    border-color: var(--shadow);

    transition: all linear 150ms;
  }

  button.input:hover {
    border-color: var(--onBackgroundVariant);
  }

  button.input:focus-within {
    background-color: var(--background);
    color: var(--onBackground);
    border-color: var(--onBackground);
  }
</style>
