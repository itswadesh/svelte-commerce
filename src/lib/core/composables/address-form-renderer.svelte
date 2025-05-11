<script lang="ts">
	import { page } from '$app/state'
	import type { Address } from '$lib/core/types'
	import { onMount, type Snippet } from 'svelte'
	import { AddressSchema } from '../components/address/schema'
	import { z } from 'zod'
	import { toast } from 'svelte-sonner'

	interface Props {
		content: Snippet<[SnippetParams]>
		onsave?: (address: any) => void
		onback?: () => void
		ondelete?: (address: any) => void
		show?: boolean
		address?: Address
	}

	let { content, onback, ondelete, onsave, show = $bindable(), address = $bindable() }: Props = $props()

	interface SnippetParams {
		handleSubmit: (e: Event) => void
		handleBack: () => void
		handleDelete: () => void
	}

	function handleBack() {
		onback?.()
		show = false
	}

	function handleSubmit(e: Event) {
		e.preventDefault()

		if (address) address.countryCode = address.countryCode || page?.data?.store?.country?.code || 'AU'
		const validation = z.object(AddressSchema).safeParse(address)

		if (!validation.success) {
			toast.error(validation.error?.errors?.[0]?.message || 'Fill all feilds correctly')
			return
		}

		onsave?.(address)
		show = false
	}

	function handleDelete() {
		if (confirm('Are you sure you want to delete this address?')) {
			ondelete?.(address)
			show = false
		}
	}

	onMount(() => {
		if (!address) return
		address.countryCode = address.countryCode || page?.data?.store?.country?.code || 'AU'
	})
</script>

{@render content?.({ handleBack, handleSubmit, handleDelete })}
