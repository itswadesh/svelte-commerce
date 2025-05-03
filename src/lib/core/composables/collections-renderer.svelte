<script lang="ts">
	import type { Collection } from '$lib/core/types'
	import { collectionService } from '$lib/core/services'
	import { onMount, type Snippet } from 'svelte'

  interface Props {
    content: Snippet<[SnippetParams]> 
  }

	const { content }: Props = $props()

	interface SnippetParams {
    collectionData: Collection[]
    displayProduct: string
	}

	let displayProduct = $state('hidden')

	let collectionData = $state<Collection[]>([])

	const getCollectionData = async () => {
		let response = await collectionService.list({})
		collectionData = response?.data
	}

	onMount(() => {
		getCollectionData()
	})
</script>

{@render
  content({ collectionData, displayProduct })
}
