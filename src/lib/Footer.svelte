<style>
.margin {
	margin-right: -2px;
	margin-bottom: -1.5px;
}
</style>

<script>
import { goto } from '$app/navigation'
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import Cookie from 'cookie-universal'
import { onMount } from 'svelte'
import { KQL_PopularSearches } from './graphql/_kitql/graphqlStores'
const cookies = Cookie()

const d = new Date()
const year = d.getFullYear()
let selectedCountry = 'food.misiki.in'
let store = cookies.get('store')
onMount(async () => {
	// try {
	// 	await KQL_PopularSearches.query({ variables: { domain: store.domain } })
	// } catch (e) {}
})
function changeCountry() {
	goto(`https://${selectedCountry}`)
}
</script>

<div class="bg-gray-800">
	<div
		class="container max-w-lg mx-auto p-5 sm:p-10 flex flex-col text-white text-center tracking-wide">
		<h1 class="mb-2 text-lg font-bold uppercase">{store?.domain}</h1>

		<p class="mb-5 text-sm font-light text-gray-200">{store?.websiteLegalName}</p>

		<div class="flex justify-center space-x-2">
			<a href="https://github.com/itswadesh" target="blank">
				<div
					class="transition duration-300 hover:bg-black h-7 w-7 rounded-full flex items-center justify-center">
					<div class="margin">
						<ImageLoader src="/icons/github-white.png" alt="github" class="h-5 w-5" />
					</div>
				</div>
			</a>

			<a href="https://www.facebook.com/codenx2" target="blank">
				<div
					class="transition duration-300 hover:bg-blue-700 h-7 w-7 rounded-full flex items-center justify-center">
					<div class="margin">
						<ImageLoader src="/icons/facebook-white.png" alt="facebook" class="h-5 w-5" />
					</div>
				</div>
			</a>

			<a href="https://twitter.com/itswadesh" target="blank">
				<div
					class="transition duration-300 hover:bg-blue-700 h-7 w-7 rounded-full flex items-center justify-center">
					<div class="margin">
						<ImageLoader src="/icons/twitter-white.png" alt="twitter" class="h-5 w-5" />
					</div>
				</div>
			</a>

			<a href="https://www.instagram.com/misiki.official/" target="blank">
				<div
					class="transition duration-300 hover:bg-pink-700 h-7 w-7 rounded-full flex items-center justify-center">
					<div class="margin">
						<ImageLoader src="/icons/instagram-white.png" alt="instagram" class="h-5 w-5" />
					</div>
				</div>
			</a>

			<a href="https://linkedin.com/in/itswadesh" target="blank">
				<div
					class="transition duration-300 hover:bg-indigo-600 h-7 w-7 rounded-full flex items-center justify-center">
					<div class="margin">
						<ImageLoader src="/icons/linkedin-white.png" alt="linkedin" class="h-5 w-5" />
					</div>
				</div>
			</a>
		</div>
	</div>

	<div
		class="bg-black p-5 text-xs font-light text-white flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:justify-between">
		<div
			class="sm:w-1/2 md:w-2/3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 space-x-2 md:space-x-0 items-center">
			<p class="md:w-1/2 text-left">©{year} {store?.websiteLegalName}</p>
		</div>

		<div class="sm:w-1/2 md:w-1/3 flex flex-row items-center justify-end space-x-2">
			<a href="/" title="Home" class="hover:underline">Home</a>
			<a href="/p/sitemap" title="Sitemap" class="hover:underline">Sitemap</a>
			<a href="/p/about" title="About" class="hover:underline">About</a>
			<a href="/p/contact" title="Contact" class="hover:underline">Contact</a>
			<a href="/p/blog" title="Blog" class="hover:underline"> Blog </a>
		</div>
	</div>
</div>
