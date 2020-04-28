<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  export let model = null
  export let items = null
  export let selectedItems = {}
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
  .color-btn {
    height: 17px;
    width: 17px;
    display: inline-block;
    position: relative;
    top: 5px;
    background-repeat: no-repeat;
    border-radius: 8px;
    margin-right: 8px;
    border-color: #f3337a;
  }

  /* .containers input:checked ~ .color-btn {
    background-color: #ed54a4;
  } */

  .color-btn:after {
    content: '';
    position: absolute;
    display: none;
  }
  .containers input:checked ~ .color-btn:after {
    display: block;
  }
  .containers .color-btn:after {
    left: 4px;
    top: 4px;
    width: 6px;
    height: 6px;
    border: solid #f3337a;
    /* border-width: 0 2px 2px 0; */
    /* -webkit-transform: rotate(45deg); */
    -ms-transform: rotate(45deg);
    /* transform: rotate(45deg); */
    border-radius: 4px;
  }
</style>

{#if items}
  {#each items as i}
    {#if i.name}
      <label class="containers">
        <input
          type="radio"
          bind:group={selectedItems}
          value={i.val}
          on:change={() => dispatch('go', { model, selectedItems })} />
        <span class="checkmark color-btn" />
        <span class="font ">{i.name}</span>
        <div class="border1" />
      </label>
    {/if}
  {/each}
{/if}
