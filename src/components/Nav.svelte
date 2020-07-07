<script>
  import Search from './Search.svelte'
  import Loader from './ui/Loader.svelte'
  import { stores, goto } from '@sapper/app'
  const { preloading, session } = stores()
  import { auth } from './../store/auth.js'
  import { cart } from './../store/cart.js'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  import {
    ChevronRightIcon,
    HeartIcon,
    ShoppingCartIcon,
    SmileIcon
  } from 'svelte-feather-icons'

  export let home = false,
    loading = false

  preloading.subscribe(_ => {
    loading = _
  })

  function logout() {
    $session.user = {}
    $session.token = undefined
    auth.logout()
  }

  function closeSidebar() {
    this.sidebar = false
  }

  function search(q) {
    dispatch('search', q.detail)
  }
</script>

<style>
  .blur {
    backdrop-filter: saturate(180%) blur(5px);
  }
  .desktop-badge {
    font-size: 8px;
    right: -6px;
    top: -6px;
    height: 15px;
    width: 14px;
    border-radius: 50%;
    display: inline-block;
  }
</style>

<header class="fixed z-20 w-full bg-white shadow-lg opacity-75 blur mb-22">
  <nav class="container flex flex-wrap items-center justify-between mx-auto">
    <div class="flex flex-wrap items-center flex-shrink-0 order-1 text-orange">
      <a rel="prefetch" href="/" class="flex py-2 my-1">
        <img class="h-6 mx-2" src="/logo.png" alt="Home" />
        <span class="font-bold ">Hopyshopy</span>
      </a>
    </div>
    <div class="order-4 w-full px-2 md:w-1/2 md:mb-0 md:pr-6 md:order-3">
      <Search class="pb-2 md:pb-0" on:search={search} {home} />
    </div>
    <div class="order-3 w-16 py-3 ml-10 mr-3 md:order-4 headings">
      <div class="items-center justify-between flex-shrink-0 hidden md:flex">
        <a
          rel="prefetch"
          class="flex flex-col items-center mx-4"
          href={$session.token && $session.token != '' ? '/my/orders' : '/login'}>
          <SmileIcon class="h-5" />
          <div class="text-xs font-bold headings">Profile</div>
        </a>
        <a
          rel="prefetch"
          class="relative flex flex-col items-center mx-3"
          href="/cart">
          <ShoppingCartIcon class="h-5 ml-1" />
          <div class="flex text-xs font-bold">
            Cart
            <div
              class="absolute flex items-center justify-center px-1 font-bold text-center rounded-full primary desktop-badge"
              style="padding-top: 2px;"
              v-if="cart.qty > 0">
              {$cart.qty}
            </div>
          </div>
        </a>
      </div>
    </div>
  </nav>
</header>

<!-- <header class="sticky py-4 bg-white lg:py-0">
  <nav class="flex items-center justify-between mx-4 text-gray-700">
    <a href="/" rel="prefetch" aria-label="logo" class="mx-4">
      <img src={'/logo.png'} alt="logo" class="w-16" />
    </a>
    <div class="flex justify-center w-full px-2 border-gray-300">
      <Search on:search={search} {home} />
    </div>
    {#if $session.token && $session.token != ''}
      <a href="/my/orders" class="flex items-center mx-4" aria-label="Account">
        <i class="mr-2 fa fa-user" />
        <span class="hidden lg:block">Account</span>
      </a>
    {:else}
      <a href="/login" class="flex items-center mx-4" aria-label="Login">
        <i class="mr-2 fa fa-user" />
        <span class="hidden lg:block">Login</span>
      </a>
    {/if}
    <a href="/cart" class="relative flex items-center mr-4">
      <i class="mr-2 fa fa-shopping-cart" />
      <span class="hidden lg:block">Cart</span>
      <div
        class="absolute px-1 font-bold text-center rounded-full primary desktop-badge">
        <div class="number">{$cart.qty}</div>
      </div>
    </a>
  </nav>
</header> -->
