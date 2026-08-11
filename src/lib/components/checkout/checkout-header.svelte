<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { goto } from '$app/navigation'
	import { appendOneTimeCartId, cn } from '$lib/core/utils/index.js'

	let { step = 1 } = $props()
</script>

<!-- Shown on mobile too: it is the only step context and the only way back to cart/address there.
     Below sm only the current step keeps its label so all four steps still fit. -->
<div class="mb-8">
	<div class="flex items-center justify-center space-x-2 sm:space-x-4 md:space-x-8">
		<!-- Step 1: Cart -->
		<Button
			variant="plain"
			disabled={step === 1 || step === 4}
			onclick={() => goto(appendOneTimeCartId('/checkout/cart'))}
			class={cn(
				'flex h-auto items-center p-0 font-normal disabled:opacity-100',
				step === 1 ? 'text-primary' : 'text-inherit'
			)}
		>
			<div
				class={cn(
					'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold tracking-tight',
					step === 1 ? 'bg-primary border-primary text-primary-foreground' : 'border-gray-200'
				)}
			>
				1
			</div>
			<span class="ml-2 text-xs font-bold uppercase tracking-widest {step === 1 ? '' : 'hidden sm:inline'}">Cart</span>
		</Button>

		<div class="h-px w-4 bg-gray-200 sm:w-8 md:w-16"></div>

		<!-- Step 2: Address -->
		<Button
			variant="plain"
			disabled={step === 1 || step === 4}
			onclick={() => goto(appendOneTimeCartId('/checkout/address'))}
			class={cn(
				'flex h-auto items-center p-0 font-normal hover:bg-transparent disabled:opacity-100',
				step === 2 ? 'text-primary' : step === 1 ? 'text-gray-400 hover:text-gray-900' : 'text-inherit'
			)}
		>
			<div
				class={cn(
					'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold tracking-tight',
					step === 2 ? 'bg-primary border-primary text-primary-foreground' : 'border-gray-200'
				)}
			>
				2
			</div>
			<span class="ml-2 text-xs font-bold uppercase tracking-widest {step === 2 ? '' : 'hidden sm:inline'}">Address</span>
		</Button>

		<div class="h-px w-4 bg-gray-200 sm:w-8 md:w-16"></div>

		<!-- Step 3: Payment -->
		<Button
			variant="plain"
			disabled={true}
			class={cn(
				'flex h-auto items-center p-0 font-normal hover:bg-transparent disabled:opacity-100',
				step === 3 ? 'text-primary' : 'text-gray-400'
			)}
		>
			<div
				class={cn(
					'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold tracking-tight',
					step === 3 ? 'bg-primary border-primary text-primary-foreground' : 'border-gray-200'
				)}
			>
				3
			</div>
			<span class="ml-2 text-xs font-bold uppercase tracking-widest {step === 3 ? '' : 'hidden sm:inline'}">Payment</span>
		</Button>

		<div class="h-px w-4 bg-gray-200 sm:w-8 md:w-16"></div>

		<!-- Step 4: Placed -->
		<Button
			variant="plain"
			disabled={true}
			class={cn(
				'flex h-auto items-center p-0 font-normal hover:bg-transparent disabled:opacity-100',
				step === 4 ? 'text-primary' : 'text-gray-400'
			)}
		>
			<div
				class={cn(
					'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold tracking-tight',
					step === 4 ? 'bg-primary border-primary text-primary-foreground' : 'border-gray-200'
				)}
			>
				4
			</div>
			<span class="ml-2 text-xs font-bold uppercase tracking-widest {step === 4 ? '' : 'hidden sm:inline'}">Placed</span>
		</Button>
	</div>
</div>
