<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let id = "",
    model = [],
    items = [],
    selectedItems = [],
    color = "none",
    circle = false,
    count = "",
    name = "",
    required = false,
    disabled = false,
    size = "",
    title = "",
    fontSize = "";

  function changed() {
    dispatch("change", model);
  }
</script>

<style>
  .filter-container {
    max-height: 400px;
    overflow: auto;
  }
  .common-checkboxIndicator {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 16px;
    height: 16px;
    border: 1px solid #c3c2c9;
    background: #fff;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    margin-top: 1px;
  }
  .common-customCheckbox {
    position: relative;
    cursor: pointer;
  }
  .common-customCheckbox input:checked ~ .common-checkboxIndicator {
    border: none;
    background: #ff3f6c;
  }
  .common-checkboxIndicator:after {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    width: 8px;
    height: 5px;
    border: 2px solid #fff;
    border-color: #fff;
    border-top-style: none;
    border-right-style: none;
    -webkit-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  label {
    line-height: 2;
    cursor: pointer;
  }
</style>

<!-- {selectedItems} -->
<p class="ml-2 py-2 font-semibold text-sm px-2">{title}</p>
<ul class="ml-2 py-2 px-2 filter-container">
  {#each items as i}
    {#if i.key}
      <li>
        <label
          class="vertical-filters-label common-customCheckbox hover:bg-none">
          <input
            type="checkbox"
            {name}
            {disabled}
            {required}
            {color}
            bind:group={selectedItems}
            value={i.key}
            on:change={() => dispatch('go', { model, selectedItems })} />
          {#if color}
            <span
              data-colorhex="black"
              class="colour-label colour-colorDisplay"
              style.background-color={color} />
          {/if}
          <span class="text-gray-800 ml-2 text-sm">{i.key}</span>
          <span class="text-gray-500 text-xs">({i.doc_count})</span>
          <div class="common-checkboxIndicator" />
        </label>
      </li>
    {/if}
  {/each}
</ul>
