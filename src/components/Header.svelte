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
  <nav class="flex items-center justify-between m-4 text-gray-700">
    <a href="/" rel="prefetch" aria-label="logo" class="mx-4">
      <img class="w-6 h-6" src="/favicon.png" alt="logo" />
    </a>
    <div class="mx-2 border-gray-300 relative" style="flex:1">
      <Search on:search={search} {home} />
    </div>
    <div class="ml-4">
      <i class="fa fa-user" />
      {#if $session.token && $session.token != ''}
        <a href="/account" class="no-underline">Account</a>
      {:else}
        <a href="/login" class="mr-4">Login</a>
      {/if}
    </div>
    <div>
      <i class="fa fa-shopping-cart" />
      <a href="/cart" class="mr-4">Cart</a>
    </div>
  </nav>
</header>
