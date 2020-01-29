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
    loading = false;

  preloading.subscribe(_ => {
    loading = _;
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

<style>
  .desktop-badge {
    font-size: 8px;
    left: 11px;
    top: -6px;
    height: 15px;
    width: 14px;
    border-radius: 50%;
    display: inline-block;
  }
  .desktop-badge .number {
    margin-top: 1.5px;
    margin-left: -1px;
  }
  .sticky {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>

<header class="sticky bg-white py-4 lg:py-0">
  <nav class="flex items-center justify-between mx-4 text-gray-700">
    <a href="/" rel="prefetch" aria-label="logo" class="mx-4">
      <img src={'/favicon.png'} alt="logo" style="width:100%;" />
    </a>
    <div class="flex justify-center w-full px-2 border-gray-300">
      <Search on:search={search} {home} />
    </div>
    {#if $session.token && $session.token != ''}
      <a href="/my/orders" class="mx-4 flex items-center" aria-label="Account">
        <i class="fa fa-user mr-2" />
        <span class="hidden lg:block">Account</span>
      </a>
    {:else}
      <a href="/login" class="mx-4 flex items-center" aria-label="Login">
        <i class="fa fa-user mr-2" />
        <span class="hidden lg:block">Login</span>
      </a>
    {/if}
    <a href="/cart" class="mr-4 flex items-center relative">
      <i class="fa fa-shopping-cart mr-2" />
      <span class="hidden lg:block">Cart</span>
      <div
        class="primary font-bold desktop-badge rounded-full px-1 absolute
        text-center">
        <div class="number">{$cart.qty}</div>
      </div>
    </a>
  </nav>
  <!-- {#if loading}
    <Loader />
  {/if} -->
</header>
