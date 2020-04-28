<script>
  import Nav from './../../components/Nav.svelte'
  import AccountMenu from './_AccountMenu.svelte'
  import { fadeIn, fadeOut } from './../../actions/pageFade'
  export let segment
</script>

<main in:fadeIn out:fadeOut>
  <Nav />
  <div
    class="flex flex-wrap lg:flex-no-wrap justify-center bg-gray-100 lg:p-5
    lg:mt-10"
    style="min-height:84vh;">
    <div class="hidden lg:block lg:w-1/5 text-center bg-white shadow rounded">
      <AccountMenu {segment} />
    </div>
    <div class="w-full bg-white shadow rounded lg:ml-5 p-2 ">
      <slot />
    </div>
  </div>
</main>
