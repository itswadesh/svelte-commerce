<script>
  import Header from "./../../components/Header.svelte";
  import AccountMenu from "./_AccountMenu.svelte";
  import { fadeIn, fadeOut } from "./../../actions/pageFade";
  export let segment;
</script>

<main in:fadeIn out:fadeOut>
  <Header />
  <div
    class="flex flex-wrap lg:flex-no-wrap justify-center bg-gray-100 pb-5
    lg:mt-10 ml-4">
    <div class="hidden lg:block">
      <AccountMenu />
    </div>
    <div class="w-full">
      <slot />
    </div>
  </div>
</main>
