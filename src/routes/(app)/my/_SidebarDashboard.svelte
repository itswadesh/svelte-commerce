<style>
.active {
	@apply bg-primary-700;
}
.active-submenu {
	@apply text-primary-700 hover:text-white;
}
</style>

<script>
import { page } from '$app/stores'
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let me, sidebar

function close() {
	dispatch('close')
	// sidebar.hidden = ''
}
</script>

{#if sidebar}
	<aside aria-label="Sidebar">
		<div>
			<div
				aria-controls="dropdown-example"
				data-collapse-toggle="dropdown-example"
				class="w-full whitespace-pre-wrap text-left text-sm tracking-wider">
				{#if sidebar.hidden === 'hidden' && sidebar.downArrow !== '' && sidebar?.subItems && sidebar?.subItems[0]?.name !== ''}
					<!-- submenu is present -->

					<a
						data-sveltekit-preload-data
						on:click="{() => (sidebar.hidden = '')}"
						href="{sidebar.url}"
						aria-label="Click to route this page"
						class:active="{$page.url.pathname === sidebar.pathName}"
						class="flex w-full items-center justify-start gap-2 p-3 text-white">
						<div
							class="dutaion-500 flex flex-1 transform items-center gap-2 transition hover:translate-x-2">
							<div>
								{@html sidebar.svg}
							</div>

							<span class="flex-1 whitespace-pre-wrap capitalize" sidebar-toggle-item>
								{sidebar.name}
							</span>
						</div>

						{#if sidebar.downArrow !== '' && sidebar?.subItems && sidebar?.subItems[0]?.name !== ''}
							<!-- open and close arrow -->

							<svg
								on:click="{() => close()}"
								data-accordion-icon=""
								class="h-5 w-5 flex-shrink-0 
									{sidebar.hidden === 'hidden' ? '' : 'transform -rotate-180'}"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg">
								<path
									fill-rule="evenodd"
									d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 
										0l-4-4a1 1 0 010-1.414z"
									clip-rule="evenodd"></path>
							</svg>
						{/if}
					</a>

					<!-- Theres no submenu -->
				{:else if sidebar.hidden !== ''}
					<a
						data-sveltekit-preload-data
						on:click="{() => close()}"
						href="{sidebar.url}"
						aria-label="Click to route this page"
						class:active="{$page.url.pathname === sidebar.pathName}"
						class="flex w-full items-center justify-start gap-2 p-3 text-white">
						<div
							class="dutaion-500 flex flex-1 transform items-center gap-2 transition hover:translate-x-2">
							<div>
								{@html sidebar.svg}
							</div>

							<span class="flex-1 whitespace-pre-wrap capitalize" sidebar-toggle-item>
								{sidebar.name}
							</span>
						</div>

						{#if sidebar.downArrow !== '' && sidebar?.subItems && sidebar?.subItems[0]?.name !== ''}
							<!-- open and close arrow -->

							<svg
								on:click="{() => close()}"
								data-accordion-icon=""
								class="h-5 w-5 flex-shrink-0 
									{sidebar.hidden === 'hidden' ? '' : 'transform -rotate-180'}"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg">
								<path
									fill-rule="evenodd"
									d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
									clip-rule="evenodd"></path>
							</svg>
						{/if}
					</a>
				{/if}
			</div>

			<ul id="dropdown-example" class="{sidebar.hidden}">
				{#if sidebar && sidebar.subItems}
					{#each sidebar.subItems as subItems}
						<li>
							<a
								data-sveltekit-preload-data
								on:click="{() => close()}"
								href="{subItems.url}"
								aria-label="Click to route this page"
								class:active-submenu="{$page.url?.pathname === subItems.pathName}">
								<div class="px-3 py-2 capitalize text-white">
									{subItems.name}
								</div>
							</a>
						</li>
					{/each}
				{/if}
			</ul>
		</div>
	</aside>
{/if}
