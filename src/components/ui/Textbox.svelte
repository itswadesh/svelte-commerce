<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let label = "",
    type = "text",
    value = "",
    cls = "";
</script>

<style>
  .group {
    position: relative;
    /* margin-bottom: 1.5rem; */
  }
  label {
    pointer-events: none;
    position: absolute;
    left: 10px;
    top: 12px;
    color: rgba(0, 0, 0, 0.36);
    transition: all 0.2s ease;
  }
  input:focus {
    box-shadow: none;
    background-color: #eff1f4;
    border: none;
    border-bottom: 2px solid #ed54a4;
  }
  input {
    top: 20px;
    height: 48px;
    line-height: 20px;
    padding: 14px 12px 0;
  }
  input:focus + label,
  input:valid + label {
    font-size: 75%;
    transform: translate3d(0, -10%, 0);
    opacity: 1;
    top: 5px;
  }
</style>

<div class={cls}>
  <div class="group">
    <input
      bind:value
      class="bg-gray-200 border-b w-full rounded hover:bg-gray-300
      focus:outline-none focus:border-pink-500"
      required
      :aria-label="label" />
    <label class="text-gray-500">{label}</label>
  </div>
</div>
