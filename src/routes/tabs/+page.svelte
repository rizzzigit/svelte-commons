<script lang="ts">
  import Button, { ButtonClass } from "$lib/widgets/button.svelte";
  import Tab, { createTabId, type SetTabFunction, type TabItem } from "$lib/widgets/tab.svelte";

  const tabs: TabItem[] = [
    {
      name: "Tab 1",
      view: page1
    },
    {
      name: "Tab 2",
      view: page1
    }
  ];

  const tabId = createTabId(tabs, 0);
</script>

{#snippet page1()}

{/snippet}

<Tab id={tabId}>
  {#snippet host(tabs, currentIndex, setTab)}
    {#each tabs as tab, index}
      <Button
        buttonClass={ButtonClass.Transparent}
        outline={false}

        onClick={() => {
          if (index != currentIndex) {
            setTab(index)
          }
        }}
      >
        <div class="button {index === currentIndex ? 'active' : ''}">
          {tab.name}
        </div>
      </Button>
    {/each}
  {/snippet}
</Tab>

<style lang="scss">
  div.button {
    border-bottom: solid 2px transparent;

    padding: 8px;
  }

  div.button.active {
    border-bottom-color: var(--primary);
  }
</style>
