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

<div class="p-10 border-b border-gray-200 text-center">
  <span
    class="h-20 w-20 p-2 text-4xl text-gray-600 rounded-full bg-gray-200
    inline-block">
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
      class="w-full flex flex-wrap text-lg items-center">
      <div class="w-1/5">
        <i class="fa fa-archive p-5" aria-hidden="true" />
      </div>
      <div class="w-4/5 text-left p-3">Orders</div>
    </a>
  </li>
  <li>
    <a
      href="/my/address"
      class:text-red-500={segment == 'address'}
      class="w-full flex flex-wrap text-lg items-center">
      <div class="w-1/5">
        <i class="fa fa-address-card p-5" aria-hidden="true" />
      </div>
      <div class="w-4/5 text-left p-3">Address</div>
    </a>
  </li>
  <li>
    <a
      href="/my/profile"
      class:text-red-500={segment == 'profile'}
      class="w-full flex flex-wrap text-lg items-center">
      <div class="w-1/5">
        <i class="fa fa-user-circle p-5" aria-hidden="true" />
      </div>
      <div class="w-4/5 text-left p-3">Profile Details</div>
    </a>
  </li>
  <li>
    <a
      href="/my/password"
      class="w-full flex flex-wrap text-lg items-center"
      class:text-red-500={segment == 'password'}>
      <div class="w-1/5">
        <i class="fa fa-key p-5" aria-hidden="true" />
      </div>
      <div class="w-4/5 text-left p-3">Password</div>
    </a>
  </li>
  <li>
    <button on:click={logout} class="logout w-full flex flex-wrap text-lg">
      <div class="w-1/5">
        <i class="fa fa-power-off p-5" aria-hidden="true" />
      </div>
      <div class="w-4/5 text-left p-3">Sign Out</div>
    </button>
  </li>
</ul>
