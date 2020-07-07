<script>
  import { first } from './../../lib'
  import { stores, goto } from '@sapper/app'
  const { session, page } = stores()
  import Cookie from 'cookie-universal'
  const cookies = Cookie()
  import { fadeIn, fadeOut } from './../../actions/pageFade'
  let selected = true
  export let segment
  // $: user = $session.user || {};
  function logout() {
    $session.user = {}
    $session.token = null
    cookies.set('token', null)
    goto('/')
  }
</script>

<style scoped>
  ul > li:hover {
    background-color: #f6f6f6;
  }
  .logout {
    cursor: pointer;
  }
</style>

<div class="p-10 text-center border-b border-gray-200">
  <span
    class="inline-block w-20 h-20 p-2 text-4xl text-gray-600 bg-gray-200 rounded-full">
    {first($session.user.firstName || 'A')}
  </span>
  <br />
  <span class="text-lg">
    {#if $session.user.firstName}{$session.user.firstName}{/if}
  </span>
  <span class="text-sm text-gray-500">
    {#if $session.user.email}{$session.user.email}{/if}
  </span>
</div>
<ul>
  <li>
    <a
      href="/my/orders"
      class:text-red-500={segment == 'orders'}
      class="flex flex-wrap items-center w-full text-lg">
      <div class="w-1/5">
        <i class="p-5 fa fa-archive" aria-hidden="true" />
      </div>
      <div class="w-4/5 p-3 text-left">Orders</div>
    </a>
  </li>
  <li>
    <a
      href="/my/address"
      class:text-red-500={segment == 'address'}
      class="flex flex-wrap items-center w-full text-lg">
      <div class="w-1/5">
        <i class="p-5 fa fa-address-card" aria-hidden="true" />
      </div>
      <div class="w-4/5 p-3 text-left">Address</div>
    </a>
  </li>
  <li>
    <a
      href="/my/profile"
      class:text-red-500={segment == 'profile'}
      class="flex flex-wrap items-center w-full text-lg">
      <div class="w-1/5">
        <i class="p-5 fa fa-user-circle" aria-hidden="true" />
      </div>
      <div class="w-4/5 p-3 text-left">Profile Details</div>
    </a>
  </li>
  <li>
    <a
      href="/my/password"
      class="flex flex-wrap items-center w-full text-lg"
      class:text-red-500={segment == 'password'}>
      <div class="w-1/5">
        <i class="p-5 fa fa-key" aria-hidden="true" />
      </div>
      <div class="w-4/5 p-3 text-left">Password</div>
    </a>
  </li>
  <li>
    <button on:click={logout} class="flex flex-wrap w-full text-lg logout">
      <div class="w-1/5">
        <i class="p-5 fa fa-power-off" aria-hidden="true" />
      </div>
      <div class="w-4/5 p-3 text-left">Sign Out</div>
    </button>
  </li>
</ul>
