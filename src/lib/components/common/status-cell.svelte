<script lang="ts">
	import { Undo, Package2 } from 'lucide-svelte'

	let { value }: { value?: string } = $props()

	const isPositiveStatus = $derived(
		value?.toLowerCase() === 'active' ||
			value?.toLowerCase() === 'true' ||
			value?.toLowerCase() === 'yes' ||
			value?.toLowerCase() === 'fulfilled' ||
			value?.toLowerCase() === 'paid' ||
			value?.toLowerCase() === 'delivered' ||
			value?.toLowerCase() === 'published' ||
			value?.toLowerCase() === 'confirmed'
	)
	const isWarningStatus = $derived(value?.toLowerCase() === 'processing' || value?.toLowerCase() === 'unpaid')
	const isPartiallyPaid = $derived(value?.toLowerCase() === 'partially_paid')
	const isAuthorized = $derived(value?.toLowerCase() === 'authorized')
	const isPending = $derived(value?.toLowerCase() === 'pending')
	const isFulfilling = $derived(value?.toLowerCase() === 'fulfilling')
	const isInfoStatus = $derived(value?.toLowerCase() === 'shipped')
	const isRefunded = $derived(value?.toLowerCase() === 'refunded')
	const isErrorStatus = $derived(
		value?.toLowerCase() === 'failed' ||
			value?.toLowerCase() === 'error' ||
			value?.toLowerCase() === 'cancelled' ||
			value?.toLowerCase() === 'rejected' ||
			value?.toLowerCase() === 'false'
	)
</script>

{#if value}
	<span
		class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium uppercase {isPositiveStatus
			? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
			: isWarningStatus
				? 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'
				: isPartiallyPaid
					? 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20'
					: isAuthorized
						? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
						: isPending
							? 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20'
							: isFulfilling
								? 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20'
								: isInfoStatus
									? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
									: isErrorStatus
										? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
										: isRefunded
											? 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20'
											: 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20'}"
	>
		{#if isRefunded}
			<Undo class="h-3 w-3 text-orange-600" />
		{:else if isFulfilling}
			<Package2 class="h-3 w-3 text-purple-600" />
		{:else}
			<span class="relative mr-1 flex h-1.5 w-1.5">
				<span
					class="absolute inline-flex h-full w-full animate-ping rounded-full {isPositiveStatus
						? 'bg-green-400'
						: isWarningStatus
							? 'bg-yellow-400'
							: isPartiallyPaid
								? 'bg-indigo-400'
								: isAuthorized
									? 'bg-blue-400'
									: isPending
										? 'bg-gray-400'
										: isInfoStatus
											? 'bg-blue-400'
											: isErrorStatus
												? 'bg-red-400'
												: 'bg-gray-400'} opacity-75"
				></span>
				<span
					class="relative inline-flex h-1.5 w-1.5 rounded-full {isPositiveStatus
						? 'bg-green-500'
						: isWarningStatus
							? 'bg-yellow-500'
							: isPartiallyPaid
								? 'bg-indigo-500'
								: isAuthorized
									? 'bg-blue-500'
									: isPending
										? 'bg-gray-500'
										: isInfoStatus
											? 'bg-blue-500'
											: isErrorStatus
												? 'bg-red-500'
												: 'bg-gray-500'}"
				></span>
			</span>
		{/if}
		{value}
	</span>
{/if}
