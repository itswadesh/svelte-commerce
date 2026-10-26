<script lang="ts">
	import { Undo, Package2 } from '@lucide/svelte'

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
			? 'bg-success/10 text-success ring-1 ring-inset ring-success/20'
			: isWarningStatus
				? 'bg-warning/10 text-warning ring-1 ring-inset ring-warning/20'
				: isPartiallyPaid
					? 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/20'
					: isAuthorized
						? 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/20'
						: isPending
							? 'bg-muted text-foreground ring-1 ring-inset ring-border'
							: isFulfilling
								? 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/20'
								: isInfoStatus
									? 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/20'
									: isErrorStatus
										? 'bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/20'
										: isRefunded
											? 'bg-warning/10 text-warning ring-1 ring-inset ring-warning/20'
											: 'bg-muted text-foreground ring-1 ring-inset ring-border'}"
	>
		{#if isRefunded}
			<Undo class="h-3 w-3 text-warning" />
		{:else if isFulfilling}
			<Package2 class="h-3 w-3 text-primary" />
		{:else}
			<span class="relative mr-1 flex h-1.5 w-1.5">
				<span
					class="absolute inline-flex h-full w-full animate-ping rounded-full {isPositiveStatus
						? 'bg-success'
						: isWarningStatus
							? 'bg-warning'
							: isPartiallyPaid
								? 'bg-primary'
								: isAuthorized
									? 'bg-primary'
									: isPending
										? 'bg-muted-foreground'
										: isInfoStatus
											? 'bg-primary'
											: isErrorStatus
												? 'bg-destructive'
												: 'bg-muted-foreground'} opacity-75"
				></span>
				<span
					class="relative inline-flex h-1.5 w-1.5 rounded-full {isPositiveStatus
						? 'bg-success'
						: isWarningStatus
							? 'bg-warning'
							: isPartiallyPaid
								? 'bg-primary'
								: isAuthorized
									? 'bg-primary'
									: isPending
										? 'bg-muted-foreground'
										: isInfoStatus
											? 'bg-primary'
											: isErrorStatus
												? 'bg-destructive'
												: 'bg-muted-foreground'}"
				></span>
			</span>
		{/if}
		{value}
	</span>
{/if}
