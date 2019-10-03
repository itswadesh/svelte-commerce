<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let title = null;
  export let model = null;
  export let items = null;
  export let selectedItems = [];
</script>

<style>
  .font {
    font-size: 0.8rem;
  }
  .border1 {
    border-bottom: 1px solid #f7efef;
    width: 100%;
    margin-left: 2rem;
    padding-top: 0.5rem;
  }
  .containers {
    display: block;
    position: relative;
    padding-left: 13px;
    margin-bottom: 12px;
    font-size: 22px;
    user-select: none;
    margin-top: 0.5rem;
  }

  .containers input {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
  }

  .checkmark {
    height: 14px;
    width: 14px;
    display: inline-block;
    position: relative;
    top: 2px;
    background-repeat: no-repeat;
    border: 1px solid #a4a4a4;
    border-radius: 3px;
    margin-right: 12px;
  }
  .containers input:checked ~ .checkmark {
    background-color: #ed54a4;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }
  .containers input:checked ~ .checkmark:after {
    display: block;
  }
  .containers .checkmark:after {
    left: 4px;
    top: 1px;
    width: 2px;
    height: 6px;
    border: solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }
</style>

{#if items}
  {#each items as i}
    {#if i.name}
      <label class="containers">
        <input
          type="checkbox"
          bind:group={selectedItems}
          value={i.name}
          on:change={() => dispatch('go', { model, selectedItems })} />
        <span class="checkmark" />
        <span class="font ">{i.name}</span>
        <div class="border1" />
      </label>
    {/if}
  {/each}
{/if}
