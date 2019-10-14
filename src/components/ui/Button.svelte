<script>
  export let icon = "",
    size = "default",
    text = "",
    color = "none",
    rounded = false,
    large = false;
</script>

<button
  {rounded}
  on:click
  class="px-4 font-bold text-{size} bg-purple-500 hover:bg-purple-600 text-white"
  class:rounded
  class:font-bold={size == 'xl'}>
  <slot />
</button>
