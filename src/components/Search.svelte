<script>
  import { goto, stores } from "@sapper/app";
  const { session, page } = stores();
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let home = false;
  let query;
  let searchInput;
  import { onMount } from "svelte";
  onMount(() => {
    if (!home && query.q) setTimeout(() => searchInput.focus(), 0);
  });
  page.subscribe(page => {
    query = page.query;
  });
  function search() {
    // When coming from home (or another page)
    if (home) goto("/search?q=" + query.q);
    // goto reloads the page. Hence focus is lost
    else history.pushState({}, null, "/search?q=" + query.q);
    dispatch("search", query.q);
  }
</script>

<form novalidate autocomplete="off" on:submit|preventDefault={search}>
  <div class="absolute">
    <i class="fa fa-search m-3 text-gray-500" aria-hidden="true" />
  </div>
  <input
    aria-label="Search Box"
    type="text"
    on:input={() => search(query.q)}
    bind:this={searchInput}
    bind:value={query.q}
    class="w-full px-10 bg-purple-white pr-4 border border-gray-200 rounded
    border-0 h-10 focus:outline-none text-xs shadow"
    placeholder="Search for products,brands and more"
    name="search" />
</form>
