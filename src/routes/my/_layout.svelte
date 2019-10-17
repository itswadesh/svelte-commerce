<script>
  import { first } from "./../../lib";
  import Header from "./../../components/Header.svelte";
  import { stores, goto } from "@sapper/app";
  const { session, page } = stores();
  import Cookie from "cookie-universal";
  const cookies = Cookie();
  import { fadeIn, fadeOut } from "./../../actions/pageFade";
  let selected = true;
  export let segment;
  // $: user = $session.user || {};
  function logout() {
    $session.user = {};
    cookies.set("token", null);
    goto("/");
  }
</script>

<style scoped>
  ul > li:hover {
    background-color: #f6f6f6;
  }
  .logout {
    cursor: pointer;
  }
  .hr-line {
    border-bottom: 1px solid lightgray;
  }
  .fa-truck {
    transform: scaleX(-1);
  }
  .bb {
    border-bottom: 1px dashed lightgray;
  }
  .fa-truck,
  .fa-undo,
  .fa-shield {
    font-size: 2rem;
  }
</style>

<main in:fadeIn out:fadeOut>
  <Header />
  <div class="flex flex-wrap justify-center bg-gray-100 pb-5 lg:mt-10">
    <div
      class="w-full text-center lg:w-1/5 bg-white shadow leading-loose rounded">
      <div class="w-full p-10 border-b border-gray-200">
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
            class:text-pink-500={segment == 'orders'}
            class="w-full flex flex-wrap text-lg">
            <div class="w-1/5">
              <i class="fa fa-archive p-5" aria-hidden="true" />
            </div>
            <div class="w-4/5 text-left p-3">Orders</div>
          </a>
        </li>
        <li>
          <a
            href="/my/address"
            class:text-pink-500={segment == 'address'}
            class="w-full flex flex-wrap text-lg">
            <div class="w-1/5">
              <i class="fa fa-address-card p-5" aria-hidden="true" />
            </div>
            <div class="w-4/5 text-left p-3">Address</div>
          </a>
        </li>
        <li>
          <a
            href="/my/profile"
            class:text-pink-500={segment == 'profile'}
            class="w-full flex flex-wrap text-lg">
            <div class="w-1/5">
              <i class="fa fa-user-circle p-5" aria-hidden="true" />
            </div>
            <div class="w-4/5 text-left p-3">Profile Details</div>
          </a>
        </li>
        <li>
          <a
            href="/my/password"
            class="w-full flex flex-wrap text-lg"
            class:text-pink-500={segment == 'password'}>
            <div class="w-1/5">
              <i class="fa fa-key p-5" aria-hidden="true" />
            </div>
            <div class="w-4/5 text-left p-3">Password</div>
          </a>
        </li>
        <li>
          <button
            on:click={logout}
            class="logout w-full flex flex-wrap text-lg">
            <div class="w-1/5">
              <i class="fa fa-power-off p-5" aria-hidden="true" />
            </div>
            <div class="w-4/5 text-left p-3">Sign Out</div>
          </button>
        </li>
      </ul>
    </div>
    <div class="m-10">
      <slot />
    </div>
  </div>
</main>
