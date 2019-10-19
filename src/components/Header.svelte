<script>
  import Search from "./Search.svelte";
  import Loader from "./ui/Loader.svelte";
  import { stores, goto } from "@sapper/app";
  const { preloading, session } = stores();
  import { auth } from "./../store/auth.js";
  import { cart } from "./../store/cart.js";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let home = false,
    mysearch = false,
    loading = false,
    segment;

  preloading.subscribe(_ => {
    if (_ == true)
      setTimeout(function() {
        loading = _;
      }, 250);
    else loading = _;
  });

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
    {#if $session.token && $session.token != ''}
      <a href="/my" class="mx-4">
        <i class="fa fa-user" />
        <span class="hidden lg:block">Account</span>
      </a>
    {:else}
      <a href="/login" class="mx-4">
        <i class="fa fa-user" />
        <span class="hidden lg:block">Login</span>
      </a>
    {/if}
    <a href="/cart" class="mr-4">
      <i class="fa fa-shopping-cart" />
      <span class="hidden lg:block">Cart ({$cart.qty})</span>
    </a>
  </nav>
  {#if loading}
    <Loader />
  {/if}
</header>
