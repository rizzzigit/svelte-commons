<script lang="ts">
  import Input, { InputType } from "$lib/widgets/input.svelte";
  import { type Writable, writable } from "svelte/store";

  const inputValue: Writable<string> = writable("");

  let focus: () => void;
</script>

<div style="display:flex; font-size: 18px">
  <Input
    bind:focus
    icon={"fa-regular fa-folder"}
    type={InputType.Password}
    name="New Folder Name"
    value={inputValue}
  />
</div>

<p>{$inputValue}</p>
<button onclick={focus}>Focus</button>
