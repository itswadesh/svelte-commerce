<script>
  import Megamenu from "./Megamenu.svelte";
  import Search from "./Search.svelte";
  import { stores, goto } from "@sapper/app";
  const { session } = stores();
  import { auth } from "./../routes/auth-store.js";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let home = false,
    mysearch = false;

  function logout() {
    $session.user = {};
    $session.token = undefined;
    auth.logout();
  }

  function closeSidebar() {
    this.sidebar = false;
  }
  function search(q) {
    dispatch("search", q.detail);
  }
</script>

<header>
  <nav
    class="flex items-center justify-between flex-wrap bg-white-800"
    style="box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05);">
    <div class="flex items-center flex-shrink-0 text-orange order-1">
      <a href="/" rel="prefetch">
        <img class="w-12 h-10 ml-4" src="/logo.svg" alt="" />
      </a>
      <div
        class="hidden lg:block flex flex-none text-sm py-4 xs:justify-between
        items-center text-gray order-2">
        <!-- <Megamenu /> -->
      </div>
    </div>
    <div
      class="mx-2 py-2 border-gray-300 relative order-4 sm:order-3"
      style="flex:1">
      <Search on:search={search} {home} />
    </div>
  </nav>
</header>
