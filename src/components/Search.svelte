<script>
  import { goto, stores } from '@sapper/app'
  const { session, page } = stores()
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  import { SearchIcon } from 'svelte-feather-icons'
  export let home = false
  let query
  let searchInput
  import { onMount } from 'svelte'
  onMount(() => {
    if (!home && query.q) setTimeout(() => searchInput.focus(), 0)
  })
  page.subscribe(page => {
    query = page.query
  })
  function search() {
    setTimeout(() => {
      // When coming from home (or another page)
      if (home) goto('/search?q=' + query.q)
      // goto reloads the page. Hence focus is lost
      else history.pushState({}, null, '/search?q=' + query.q)
      dispatch('search', query.q)
    }, 300)
  }
</script>

<form
  class="w-full pb-2 text-center lg:w-1/2 md:pb-0"
  novalidate
  autocomplete="off"
  on:submit|preventDefault={search}>
  <div class="search_fix" />
  <div class="absolute">
    <SearchIcon size="16" class="m-3 text-gray-500" />
  </div>
  <input
    aria-label="Search Box"
    type="text"
    on:input={() => search(query.q)}
    bind:this={searchInput}
    bind:value={query.q}
    class="w-full h-10 px-10 pr-4 text-xs border-0 rounded-b-sm shadow bg-purple-white focus:outline-none text-2"
    placeholder="Search for products,brands and more"
    name="search" />
</form>
