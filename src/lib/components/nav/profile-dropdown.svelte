<script lang="ts">
	import { getUserState } from '@misiki/kitcommerce-core/stores'

	import { X, UserCircle, ShoppingBag, MapPin, Heart, ArrowRightCircleIcon } from '@lucide/svelte'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { Button } from '$lib/components/ui/button'
	import { page } from '$app/state'
	const userState = getUserState()
	const { onSignOut } = $props()
  const wishlistPlugin = $derived(page.data?.store?.plugins?.isWishlist)
</script>

<!-- Editorial account dropdown for the default theme only (scoped via [data-theme='default']).
     The dropdown content renders in-place (bits-ui, no portal), so it stays under the app
     shell's [data-theme] ancestor and these rules never touch sarab/organic. -->
<style>
	:global([data-theme='default'] .ed-pd-trigger) {
		color: var(--ed-ink);
		transition: color 0.25s ease;
	}

	:global([data-theme='default'] .ed-pd-trigger:hover) {
		color: hsl(var(--primary));
	}

	:global([data-theme='default'] .ed-pd-menu) {
		background: var(--ed-surface);
		border: 1px solid var(--ed-line);
		border-radius: var(--ed-radius);
		box-shadow: 0 24px 48px -24px rgba(27, 26, 23, 0.28);
	}

	:global([data-theme='default'] .ed-pd-head) {
		border-color: var(--ed-line);
	}

	:global([data-theme='default'] .ed-pd-item) {
		color: var(--ed-soft);
		font-family: var(--ed-body);
		border-radius: var(--ed-radius);
	}

	:global([data-theme='default'] .ed-pd-ico) {
		background: var(--ed-canvas);
		border-radius: var(--ed-radius);
	}

	:global([data-theme='default'] .ed-pd-sep) {
		background: var(--ed-line);
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='default'] .ed-pd-trigger) {
			transition: none;
		}
	}
</style>

<DropdownMenu.Root>
	<DropdownMenu.Trigger aria-label="User Profile" class="ed-pd-trigger flex items-center justify-center rounded-full">
		{#if userState.user?.avatar}
			<div class="h-5 w-5 overflow-hidden rounded-full">
				<LazyImg
					width="20"
					height="20"
					src={userState.user?.avatar}
					alt="{userState.user?.firstName || userState.user?.name || 'User'}'s avatar"
					class="h-full w-full object-cover object-top"
				/>
			</div>
		{:else}
			<UserCircle class="h-5 w-5" />
		{/if}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content class="ed-pd-menu min-w-[240px] border-gray-100 bg-white p-2 shadow-2xl">
		<!-- User Header -->
		<div class="ed-pd-head mb-2 flex items-center gap-3 border-b border-gray-50 px-4 py-4">
			<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary">
				{#if userState.user?.avatar}
					<img src={userState.user.avatar} alt="" class="h-full w-full rounded-full object-cover" />
				{:else}
					<UserCircle class="h-6 w-6" />
				{/if}
			</div>
			<div class="overflow-hidden">
				<p class="truncate text-sm font-black text-gray-900">
					{userState.user?.firstName || userState.user?.name || 'My Account'}
				</p>
				<p class="truncate text-[10px] font-bold uppercase tracking-widest text-gray-400">
					{userState.user?.email || 'Logged In'}
				</p>
			</div>
		</div>

		<DropdownMenu.Group>
			<a href="/my/profile" class="block w-full">
				<DropdownMenu.Item
					class="ed-pd-item flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-primary"
				>
					<div class="ed-pd-ico flex h-8 w-8 items-center justify-center bg-gray-50 transition-colors group-hover:bg-white">
						<UserCircle class="h-4 w-4" />
					</div>
					Profile Settings
				</DropdownMenu.Item>
			</a>
			<a href="/my/orders" class="block w-full">
				<DropdownMenu.Item
					class="ed-pd-item flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-primary"
				>
					<div class="ed-pd-ico flex h-8 w-8 items-center justify-center bg-gray-50">
						<ShoppingBag class="h-4 w-4" />
					</div>
					Order History
				</DropdownMenu.Item>
			</a>
			<a href="/my/addresses" class="block w-full">
				<DropdownMenu.Item
					class="ed-pd-item flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-primary"
				>
					<div class="ed-pd-ico flex h-8 w-8 items-center justify-center bg-gray-50">
						<MapPin class="h-4 w-4" />
					</div>
					My Addresses
				</DropdownMenu.Item>
			</a>
      {#if wishlistPlugin?.active}
			 <a href="/my/wishlist" class="block w-full">
			 	<DropdownMenu.Item
			 		class="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-primary"
			 	>
			 		<div class="flex h-8 w-8 items-center justify-center bg-gray-50">
			 			<Heart class="h-4 w-4" />
			 		</div>
			 		My Wishlist
			 	</DropdownMenu.Item>
			  </a>
      {/if}
		</DropdownMenu.Group>

		<div class="ed-pd-sep my-2 h-px bg-gray-50"></div>

		<DropdownMenu.Item>
			<Button
				variant="ghost"
				class="flex h-auto w-full items-center justify-start gap-3 px-3 py-2.5 text-red-500"
				onclick={onSignOut}
			>
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100/30">
					<ArrowRightCircleIcon class="h-4 w-4" />
				</div>
				Sign Out
			</Button>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
