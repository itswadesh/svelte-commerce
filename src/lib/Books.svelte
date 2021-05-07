<!-- Books.svelte -->
<script>
import { query } from 'svelte-apollo'
import { GET_BOOKS } from './queries'

// 2. Execute the GET_BOOKS GraphQL query using the Apollo client
//    -> Returns a svelte store of promises that resolve as values come in
const books = query(GET_BOOKS)
</script>

<!-- 3. Use $books (note the "$"), to subscribe to query values -->
{#if $books.loading}
	Loading...
	<!-- {:else if $books.error}
    Error: {$books.error.message} -->
{:else}
	{#each $books.data.books as book}
		{book.title} by {book.author.name}
	{/each}
{/if}
