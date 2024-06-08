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
    isSaving: boolean
		handleSubmit: (e: Event) => void
		handleBack: () => void
		handleDelete: () => void
	}

  let isSaving = $state(false)

	function handleBack() {
		onback?.()
		show = false
	}

	async function handleSubmit(e: Event) {
    isSaving = true
		e.preventDefault()

		if (address) address.countryCode = address.countryCode || page?.data?.store?.country?.code || 'AU'
		const validation = z.object(AddressSchema).safeParse(address)

		if (!validation.success) {
			toast.error(validation.error?.errors?.[0]?.message || 'Fill all feilds correctly')
			return
		}

		await onsave?.(address)
		show = false
    isSaving = false
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

{@render content?.({ isSaving, handleBack, handleSubmit, handleDelete })}
