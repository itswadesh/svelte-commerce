<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer'
	import Button from '$lib/components/ui/button/button.svelte'
	import { ChevronRight, Copy, X } from 'lucide-svelte'
	import Input from '$lib/components/ui/input/input.svelte'
	import CouponDrawerRenderer from '$lib/core/composables/coupon-drawer-renderer.svelte'
	import { format } from 'date-fns'
	import { fly } from 'svelte/transition'
	import { formatPrice } from '$lib/core/utils'
	import { page } from '$app/state'

	let { open = false, code = $bindable('') } = $props()
</script>

<CouponDrawerRenderer bind:code>
	{#snippet content({ show, coupons, isChecking, handleCheck, handleCouponClick, handleCopy })}
		{#if show}
			<Drawer.Root {open} direction={innerWidth > 400 ? 'right' : 'bottom'} shouldScaleBackground={true}>
				<Drawer.Trigger>
					<Button variant="outline" class="w-full justify-between">
						Apply Promo Code
						<span class="text-muted-foreground">
							<ChevronRight class="h-4 w-4" />
						</span>
					</Button>
				</Drawer.Trigger>
				<Drawer.Content class="sm:left-auto sm:right-0 sm:top-0 sm:mt-0 sm:h-screen sm:w-fit sm:max-w-xl [&>div:first-child]:hidden">
					<div in:fly={{ duration: 300 }} class="mx-auto w-full max-w-4xl">
						<Drawer.Header class="text-left">
							<Drawer.Title>Apply Promo Code</Drawer.Title>
							<Drawer.Close
								class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
							>
								<X class="h-4 w-4" />
								<span class="sr-only">Close</span>
							</Drawer.Close>
						</Drawer.Header>
						<div class="p-4 pb-0">
							<div class="flex gap-2">
								<Input placeholder="Enter your coupon code" bind:value={code} class="flex-1" />
								<Button onclick={handleCheck} disabled={!code || isChecking}>
									{isChecking ? 'Checking...' : 'APPLY'}
								</Button>
							</div>
						</div>
						<div class="grid max-h-[80vh] grid-cols-1 gap-4 overflow-y-auto p-4 max-sm:max-h-[60vh]">
							{#each coupons as coupon}
								<div class="relative rounded-lg border p-4 transition-colors hover:bg-muted/50">
									<button onclick={() => handleCopy(coupon.code)} class="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
										<Copy class="h-4 w-4" />
										<span class="sr-only">Copy code</span>
									</button>
									<button
										onclick={() => handleCouponClick(coupon.code)}
										class="font-mono inline-block rounded border border-dashed border-primary px-3 py-1 text-sm text-primary hover:border-gray-400"
									>
										{coupon.code}
									</button>
									{#if coupon?.description}
										<p class="mt-1 text-xs text-muted-foreground">{coupon.description}</p>
									{:else}
										<p class="mt-2 text-sm">
											Order
											{#if coupon?.minAmount}
												above {formatPrice(coupon?.minAmount, page?.data?.store?.currency?.code)}
											{/if}
											& Get an Extra{' '}
											{!coupon.isPercent ? `${formatPrice(coupon?.amount, page?.data?.store?.currency?.code)}` : `${coupon.amount}%`} OFF on your entire
											purchase
										</p>
									{/if}
									<p class="mt-1 text-xs text-muted-foreground">
										Expires on : {format(coupon?.validTill || '', 'MMM dd, yyyy, hh:mm a')}
									</p>
								</div>
							{/each}
						</div>
					</div>
				</Drawer.Content>
			</Drawer.Root>
		{/if}
	{/snippet}
</CouponDrawerRenderer>
