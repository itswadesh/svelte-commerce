<script>
  export let icon = "",
    size = "default",
    text = "",
    color = "none";
</script>

<button
  {size}
  on:click
  class="px-3 py-1 text-lg font-bold rounded bg-pink-500 hover:bg-pink-600
  text-white">
  <slot />
</button>
