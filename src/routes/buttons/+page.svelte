<script lang="ts">
  import Button from "$lib/widgets/button.svelte";

  const onClick = async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));

    console.log("asd");
    throw new Error("asd");
  };
</script>

<Button {onClick}>
  <p class="test">Test</p>
</Button>

<style lang="scss">
  p.test {
    margin: 8px;
  }
</style>
