<style>
.frosted {
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
.text-extrasmall {
	font-size: 0.5rem;
}
.active {
	border-bottom: 2px solid black;
}
</style>

<script lang="ts">
import { goto } from '$app/navigation'
import { page, session } from '$app/stores'
import Cookies from 'universal-cookie'
const cookies = new Cookies()
import { spring } from 'svelte/motion'
import Search from '$lib/Search.svelte'
import { Categories } from './graphql/_kitql/graphqlTypes'
import { KQL_Cart, KQL_Me } from './graphql/_kitql/graphqlStores'
import { signOut } from './services'
import { onMount } from 'svelte'
import { toast } from './util'
const loginUrl = '/auth/otp-login'
onMount(async () => {
	await KQL_Me.query({})
	await KQL_Cart.query({ settings: { policy: 'network-only' } })
})
export let q, me, store

async function handleSignout() {
	try {
		await signOut()
		$session.me = null
		$session.token = null
		$session.sid = null
		toast('Signed Out...', 'success')
		goto('/auth/login')
	} catch (e) {
		toast(e, 'error')
	} finally {
	}
}

onMount(async () => {
	try {
		await KQL_Cart.query({ variables: { store: store?.id }, settings: { cacheMs: 0 } })
	} catch (e) {
	} finally {
	}
})
</script>

<nav class=" frosted border-gray-100 p-4 shadow-md">
	<div class="flex items-center justify-between">
		<a href="/" class="flex max-w-max items-center focus:outline-none">
			<img alt="" class="h-8" src="/logo_512.png" />
		</a>
		<div class="flex flex-row items-center">
			<a href="/cart">
				<button
					type="button"
					class="group mr-5 flex transform items-center whitespace-nowrap font-semibold hover:text-primary-500 focus:outline-none active:scale-95">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-1 h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
					</svg>
					{#if $KQL_Cart.data?.cart.qty}
						<span
							class="counter-digits text-extrasmall absolute top-0 right-0 -mr-2 -mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-black p-0.5 text-white group-hover:bg-primary-500"
							style="transform: translate(0, {100}%)">{Math.floor($KQL_Cart.data?.cart.qty)}</span>
					{/if}
				</button>
			</a>

			<!-- <a href="/wishlist">
				<button
					class="group mr-5 flex  transform items-center whitespace-nowrap hover:text-primary-500 focus:outline-none active:scale-95">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						></path>
					</svg>
				</button>
			</a> -->
			{#if me?.active}
				<a href="/my" class="mx-2 flex min-w-max items-center ">
					{#if me?.firstName}
						<div class=" mr-2 flex-1 whitespace-nowrap text-sm font-semibold">
							<span>Hi {me?.firstName}</span>
						</div>
					{/if}

					<div class="flex-shrink-0">
						{#if me?.avatar}
							<img
								src="{me?.avatar}"
								alt=""
								class="h-10 w-10 rounded-full bg-white object-contain shadow " />
						{:else}
							<img
								src="/leadership-profile.png"
								alt="user"
								class="w-8 shadow h-8  bg-white rounded-full " />
						{/if}
					</div>
				</a>
			{:else}
				<a href="{loginUrl}" class="text-sm font-semibold tracking-wide hover:text-primary-500">
					LOGIN
				</a>
			{/if}
		</div>
	</div>
</nav>
