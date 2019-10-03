<script>
  import { typingTimeout } from "./../config";
  export let search = "";
</script>

<style>
  img {
    margin-right: 1rem;
  }
</style>

<form novalidate autocomplete="off">
  <div class="search_fix" />
  <div class="absolute">
    <i class="fa fa-search m-3 text-gray-500" aria-hidden="true" />
  </div>
  <input
    type="text"
    v-model="search"
    class="w-full px-10 bg-purple-white pr-4 border border-gray-200 rounded
    border-0 h-10 focus:outline-none"
    placeholder="Search for products,brands and more"
    name="search" />
</form>
