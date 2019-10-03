<script>
  import Megamenu from "./Megamenu.svelte";
  import Search from "./Search.svelte";
  import { stores, goto } from "@sapper/app";
  const { session } = stores();
  import { auth } from "./../routes/auth-store.js";

  export let showtab = true,
    mysearch = false;

  function logout() {
    $session.user = {};
    $session.token = undefined;
    auth.logout();
  }

  function closeSidebar() {
    this.sidebar = false;
  }
</script>

<header>
  <nav
    class="flex items-center justify-between flex-wrap bg-white-800"
    style="box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05);">
    <div class="flex items-center flex-shrink-0 text-orange order-1">
      <a href="/">
        <img class="w-12 h-10 ml-4" src="/logo.svg" alt="" />
      </a>
      <div
        class="hidden lg:block flex flex-none text-sm py-4 xs:justify-between
        items-center text-gray order-2">
        <Megamenu />
      </div>
    </div>
    <div
      class="mx-2 py-2 border-gray-300 relative order-4 sm:order-3"
      style="flex:1">
      <Search />
    </div>
    <div
      class="flex items-center justify-between flex-shrink-0 py-4 order-3
      sm:order-4 mx-2 w-40">
      <a class="w-auto" href="/login" v-if="!user">
        <img class="h-4 ml-2" src="/avatar.png" alt="" />
        <div class="inline-text-gray text-xs font-bold">Profile</div>
      </a>
      <a class="w-auto" href="/my" v-else>
        <img class="h-4 ml-2" src="/avatar.png" alt="" />
        <div class="inline-text-gray text-xs font-bold">Profile</div>
      </a>
      <a class="w-auto" href="/wishlist">
        <img class="h-4 ml-3 center" src="/bookmark.png" alt="" />
        <div class="text-xs inline-text-gray font-bold">Whistlist</div>
      </a>
    </div>
  </nav>
</header>
