<script>
  import Nav from './../../components/Nav.svelte'
  import AccountMenu from './_AccountMenu.svelte'
  import { fadeIn, fadeOut } from './../../actions/pageFade'
  export let segment
</script>

<main in:fadeIn out:fadeOut>
  <Nav />
  <div
    class="flex flex-wrap justify-center bg-gray-100 lg:flex-no-wrap lg:p-5 lg:mt-10"
    style="min-height:84vh;">
    <div class="hidden text-center bg-white rounded shadow lg:block lg:w-1/5">
      <AccountMenu {segment} />
    </div>
    <div class="w-full p-2 bg-white rounded shadow lg:ml-5 ">
      <slot />
    </div>
  </div>
</main>
