<script>
import { ChevronDown, ShieldCheck, Lock, Truck, RefreshCw } from 'lucide-svelte'
import WhatsappChatButton from '$lib/core/components/plugins/whatsapp-chat-button.svelte'
import { page } from '$app/state'
import TrustpilotPlugin from '$lib/core/components/plugins/trustpilot-plugin.svelte'
import masterCard from '$lib/assets/payment-methods/mastercard.png'
import paypal from '$lib/assets/payment-methods/paypal.png'
import skrill from '$lib/assets/payment-methods/skrill.png'
import visa from '$lib/assets/payment-methods/visa.png'

let paymentMethodCards = [masterCard, paypal, skrill, visa]

let isExpanded = $state(false)
</script>
	
	<div class="mt-8">
		<footer class="mt-2 border-t">
			<div class="mx-auto w-full xl:pb-2">
				{#if page?.data?.store?.plugins?.footerSettings?.collapseOnMobile}
					<button
						class="flex w-full items-center justify-between p-4 text-sm font-medium uppercase tracking-tighter text-gray-900 dark:text-white md:hidden"
						onclick={() => (isExpanded = !isExpanded)}
					>
						<span>More about {page?.data?.store?.name}</span>
						<ChevronDown size={20} class="transition-transform duration-200 {isExpanded ? 'rotate-180' : ''}" />
					</button>
				{/if}
	
				<div class="overflow-hidden {page?.data?.store?.plugins?.footerSettings?.collapseOnMobile ? (isExpanded ? '' : 'hidden md:block') : ''}">
					<div class="gap-4 p-4 px-8 py-8 md:flex md:justify-between md:py-16 max-w-screen-xl mx-auto">
						<div class="mb-12 flex max-w-xs flex-col gap-4">
							<a href="/" class="flex items-center">
								{#if page?.data?.store?.logo}
									<img src={page?.data?.store?.logo} class="mr-2 h-10 object-contain" alt="Logo" />
								{:else}
									<span class="text-2xl font-semibold dark:text-white"> {page?.data?.store?.name} </span>
								{/if}
							</a>
							<p class="prose text-sm text-gray-600">{@html page?.data?.store?.description}</p>
	
							<!-- Address -->
							<!-- {#if page?.data?.store?.address_1}
								<p class="text-sm text-gray-600">
									{page.data.store.address_1}
									{#if page.data.store.address_2}
										,
									{/if}
									{page.data.store.address_2}
	
									<br />
									{page.data.store.city}
									{#if page.data.store.state && page.data.store.city},
									{/if}
									{page.data.store.state}
									{page.data.store.zipCode}
									<br />
									{page.data.store.country?.name}
								</p>
							{/if} -->
						</div>
						<div class="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10">
							{#each page?.data?.store?.menu?.find?.((menu) => menu?.menuId === 'footer')?.items || [] as item}
								<div>
									<h1 class="text-black-200 mb-4 text-lg font-semibold">{item?.name}</h1>
									{#if item?.items?.length > 0}
										<ul class="space-y-2">
											{#each item.items as child}
												<li>
													{#if child.link}
														<a
															href={child.link || '#'}
															target="_blank"
															class="text-sm text-gray-400 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-900"
															rel="noopener noreferrer"
														>
															{child.name}
														</a>
													{:else}
														<span class="text-sm text-gray-400">{child.name}</span>
													{/if}
												</li>
											{/each}
										</ul>
									{:else}
										<p class="text-sm text-gray-400">No links available</p>
									{/if}
								</div>
							{/each}
						</div>
					</div>
					<!-- Trust Badges -->
	<div class="w-full bg-gray-50 dark:bg-gray-800 py-6">
		<div class="w-full px-4 sm:px-6 lg:px-8">
			<div class="relative">
				<div class="absolute inset-0 w-screen -left-4 sm:-left-6 lg:-left-8 xl:-left-[calc((100vw-1280px)/2+32px)] 2xl:-left-[calc((100vw-1536px)/2+32px)] bg-gray-50 dark:bg-gray-800 -z-10" />
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-screen-xl mx-auto relative">
					<div class="flex items-center justify-center gap-3">
						<div class="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
							<ShieldCheck class="w-6 h-6 text-primary-600 dark:text-primary-300" />
						</div>
						<div>
							<p class="text-sm font-medium text-gray-900 dark:text-white">Secure Payments</p>
							<p class="text-xs text-gray-500">100% Secure</p>
						</div>
					</div>
					<div class="flex items-center justify-center gap-3">
						<div class="bg-green-100 dark:bg-green-900 p-2 rounded-full">
							<Lock class="w-6 h-6 text-green-600 dark:text-green-300" />
						</div>
						<div>
							<p class="text-sm font-medium text-gray-900 dark:text-white">SSL Certified</p>
							<p class="text-xs text-gray-500">Safe & Secure</p>
						</div>
					</div>
					<div class="flex items-center justify-center gap-3">
						<div class="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
							<Truck class="w-6 h-6 text-blue-600 dark:text-blue-300" />
						</div>
						<div>
							<p class="text-sm font-medium text-gray-900 dark:text-white">Fast Shipping</p>
							<p class="text-xs text-gray-500">Worldwide</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="flex flex-col gap-2 border-t px-8 py-4 sm:flex-row sm:items-center sm:justify-between">
						{#if page?.data?.store?.plugins?.socialSharingButtons?.active}
							<div class="flex items-center space-x-5 sm:mt-0 sm:justify-center">
								{#each Object.entries(page?.data?.store?.plugins?.socialSharingButtons || {}).filter(([key]) => !['active', 'position'].includes(key)) as [key, social]}
									{#if social}
										<a
											href={social}
											target="_blank"
											rel="nofollow"
											class="fill-gray-500 text-gray-500 hover:fill-gray-900 hover:text-gray-900 dark:hover:fill-gray-600 dark:hover:text-gray-600"
										>
											{#if key == 'twitter'}
												<svg class="size-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
													><title>X</title><path
														d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
													/></svg
												>
											{:else if key == 'facebook'}
												<svg class="size-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
													><title>Facebook</title><path
														d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
													/></svg
												>
											{:else if key == 'linkedin'}
												<svg class="size-5" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
													<path
														d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"
													></path>
												</svg>
											{:else if key == 'instagram'}
												<svg class="size-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
													><title>Instagram</title><path
														d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"
													/></svg
												>
											{:else if key == 'telegram'}
												<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"
													><path
														d="M228.88,26.19a9,9,0,0,0-9.16-1.57L17.06,103.93a14.22,14.22,0,0,0,2.43,27.21L72,141.45V200a15.92,15.92,0,0,0,10,14.83,15.91,15.91,0,0,0,17.51-3.73l25.32-26.26L165,220a15.88,15.88,0,0,0,10.51,4,16.3,16.3,0,0,0,5-.79,15.85,15.85,0,0,0,10.67-11.63L231.77,35A9,9,0,0,0,228.88,26.19Zm-61.14,36L78.15,126.35l-49.6-9.73ZM88,200V152.52l24.79,21.74Zm87.53,8L92.85,135.5l119-85.29Z"
													></path></svg
												>
											{:else if key == 'youtube'}
												<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"
													><path
														d="M164.44,121.34l-48-32A8,8,0,0,0,104,96v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,145.05V111l25.58,17ZM234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-15.49,113a8,8,0,0,1-4.77,5.49c-31.65,12.22-85.48,12-86,12H128c-.54,0-54.33.2-86-12a8,8,0,0,1-4.77-5.49C34.8,173.39,32,156.57,32,128s2.8-45.39,5.16-54.47A8,8,0,0,1,41.93,68c30.52-11.79,81.66-12,85.85-12h.27c.54,0,54.38-.18,86,12a8,8,0,0,1,4.77,5.49C221.2,82.61,224,99.43,224,128S221.2,173.39,218.84,182.47Z"
													></path></svg
												>
											{:else if key == 'whatsapp'}
												<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"
													><path
														d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"
													></path></svg
												>
											{/if}
											<span class="sr-only">{key}</span>
										</a>
									{/if}
								{/each}
							</div>
						{/if}
	
						<div class="flex w-full flex-col-reverse items-start justify-between gap-2 max-sm:mt-2 sm:flex-row sm:items-center sm:gap-0">
							<span class="text-sm text-gray-500 dark:text-gray-400 sm:text-center">
								Copyright
								{' '}
								{new Date().getFullYear()}
								{' '}
								<a href="/" class="cursor-pointer">
									{page?.data?.store?.name}
								</a>
								. All Rights Reserved.
							</span>
							<TrustpilotPlugin />
	
							{#if paymentMethodCards?.length}
								<ul class="col-span-1 m-0 flex list-none flex-wrap items-center justify-end gap-2 p-0">
									{#each paymentMethodCards as pmc}
										<li>
											<img src={pmc} alt="" class="h-8 w-auto object-contain" />
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</footer>
	</div>
	
	<WhatsappChatButton />
	
	<!-- {#if page?.data?.store?.plugins?.whatsapp?.enabled}
		<a href="https://wa.me/{page?.data?.store?.plugins.whatsapp.number}" target="_blank" rel="noopener noreferrer" class="fixed bottom-20 left-5 z-40 md:bottom-5">
		<img src={whatsappIcon} alt="" class="h-10 w-10 transform object-contain transition duration-300 hover:-translate-y-2 hover:scale-125" />
		</a>
		{/if} -->
	