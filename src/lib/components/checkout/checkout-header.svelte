<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { goto } from '$app/navigation'
	import { appendOneTimeCartId, cn } from '$lib/core/utils/index.js'

	let { step = 1 } = $props()
</script>

<div class="mb-8 hidden sm:block">
	<div class="flex items-center justify-center space-x-4 sm:space-x-12">
		<!-- Step 1: Cart -->
		<Button
			variant="ghost"
			disabled={step === 1}
			onclick={() => goto(appendOneTimeCartId('/checkout/cart'))}
			class={cn(
				'flex h-auto items-center p-0 font-normal hover:bg-transparent disabled:opacity-100',
				step === 1 ? 'text-primary' : 'text-inherit'
			)}
		>
			<div
				class={cn(
					'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold tracking-tight',
					step === 1 ? 'bg-primary border-primary text-foreground' : 'border-gray-200'
				)}
			>
				1
			</div>
			<span class="ml-2 text-xs font-bold uppercase tracking-widest">Cart</span>
		</Button>

		<div class="h-px w-8 bg-gray-200 sm:w-16"></div>

		<!-- Step 2: Address -->
		<Button
			variant="ghost"
			disabled={step === 1}
			onclick={() => goto(appendOneTimeCartId('/checkout/address'))}
			class={cn(
				'flex h-auto items-center p-0 font-normal hover:bg-transparent disabled:opacity-100',
				step === 2 ? 'text-primary' : step === 1 ? 'text-gray-400 hover:text-gray-900' : 'text-inherit'
			)}
		>
			<div
				class={cn(
					'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold tracking-tight',
					step === 2 ? 'bg-primary border-primary text-foreground' : 'border-gray-200'
				)}
			>
				2
			</div>
			<span class="ml-2 text-xs font-bold uppercase tracking-widest">Address</span>
		</Button>

		<div class="h-px w-8 bg-gray-200 sm:w-16"></div>

		<!-- Step 3: Payment -->
		<Button
			variant="ghost"
			disabled={true}
			class={cn(
				'flex h-auto items-center p-0 font-normal hover:bg-transparent disabled:opacity-100',
				step === 3 ? 'text-primary' : 'text-gray-400'
			)}
		>
			<div
				class={cn(
					'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold tracking-tight',
					step === 3 ? 'bg-primary border-primary text-foreground' : 'border-gray-200'
				)}
			>
				3
			</div>
			<span class="ml-2 text-xs font-bold uppercase tracking-widest">Payment</span>
		</Button>
	</div>
</div>
