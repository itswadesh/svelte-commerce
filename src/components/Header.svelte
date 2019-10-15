<script>
  import Search from "./Search.svelte";
  import { stores, goto } from "@sapper/app";
  const { session } = stores();
  import { auth } from "./../store/auth.js";
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
  <nav class="flex items-center justify-between p-3">
    <a href="/" rel="prefetch" aria-label="logo">
      <img class="w-6 h-6" src="/favicon.png" alt="logo" />
    </a>
    <div class="mx-2 border-gray-300 relative" style="flex:1">
      <Search on:search={search} {home} />
    </div>
  </nav>
</header>
