<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  export let label = '',
    value = '',
    cls = '',
    placeholder = ' '
</script>

<style>
  .floating-label {
    position: relative;
  }
  .floating-input {
    font-size: 14px;
    padding: 4px 4px;
    display: block;
    width: 100%;
    height: 48px;
    padding: 14px 12px 0;
    border: none;
  }

  .floating-input:focus {
    outline: none;
    border-bottom: 2px solid purple;
  }

  label {
    color: #999;
    font-size: 16px;
    font-weight: normal;
    position: absolute;
    pointer-events: none;
    left: 8px;
    top: 13px;
    transition: 0.2s ease all;
    -moz-transition: 0.2s ease all;
    -webkit-transition: 0.2s ease all;
  }

  .floating-input:focus ~ label,
  .floating-input:not(:placeholder-shown) ~ label {
    top: -1px;
    font-size: 14px;
    color: #555;
  }

  .floating-select:focus ~ label,
  .floating-select:not([value='']):valid ~ label {
    top: -18px;
    font-size: 14px;
    color: #555;
  }
</style>

<div class={cls}>
  <div class="mb-10 floating-label">
    <input
      type="password"
      bind:value
      class="w-full bg-gray-100 border-b rounded floating-input hover:bg-gray-300 focus:outline-none focus:border-pink-500"
      {placeholder}
      aria-label={label} />
    <span class="highlight" />
    <label>{label}</label>
  </div>
</div>
