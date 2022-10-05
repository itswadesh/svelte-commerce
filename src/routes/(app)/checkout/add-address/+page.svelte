<script>
import SEO from '$lib/components/SEO/index.svelte'
import Textbox from '$lib/ui/Textbox.svelte'
import BackButton from '$lib/ui/BackButton.svelte'
import Error from '$lib/components/Error.svelte'
import { goto } from '$app/navigation'
import { toast } from '$lib/util'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import { post } from '$lib/util/api'

export let data

let err,
	loading = false

const seoProps = {
	title: 'Add Address ',
	metadescription: 'Add Address '
}

async function save(ads) {
	const id = data.ads._id || 'new'
	const {
		firstName,
		lastName,
		email,
		phone,
		address,
		locality,
		city,
		district,
		state,
		country,
		zip
	} = ads
	try {
		loading = true
		const { data, errors } = await post('addresses', {
			id,
			firstName,
			lastName,
			email,
			phone,
			address,
			locality,
			city,
			district,
			state,
			country,
			zip
		})
		goto(`/checkout/address`)
	} catch (e) {
		toast(err, 'error')
		err = e
	} finally {
		loading = false
	}
}
</script>

<SEO {...seoProps} />

{#if data.ads}
	<div class="container mx-auto min-h-screen max-w-4xl p-3 py-5 sm:p-10">
		<div class="flex items-center justify-between gap-5">
			<h2 class="mb-5 text-xl font-bold capitalize tracking-wide sm:text-2xl">
				{#if data.ads.id === 'new'}
					Add New Address
				{:else}
					Edit Address
				{/if}
			</h2>

			<BackButton to="/checkout/address" class="" />
		</div>

		<Error err="{err}" />

		<form novalidate autocomplete="off" on:submit|preventDefault="{() => save(data.ads)}">
			<div class="grid grid-cols-1 gap-2 text-sm sm:gap-5 md:grid-cols-2">
				<div>
					<h6 class="mb-2 font-semibold">First Name <span class="text-red-500">*</span></h6>

					<Textbox
						type="text"
						bind:value="{data.ads.firstName}"
						placeholder="Enter First Name"
						required />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Last Name</h6>

					<Textbox type="text" bind:value="{data.ads.lastName}" placeholder="Enter First Name" />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Email <span class="text-red-500">*</span></h6>

					<Textbox type="text" bind:value="{data.ads.email}" placeholder="Enter Email" required />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Mobile number <span class="text-red-500">*</span></h6>

					<Textbox type="text" bind:value="{data.ads.phone}" placeholder="Enter Phone No" />
				</div>
				<div>
					<h6 class="mb-2 font-semibold">
						Address (Area and Street) <span class="text-red-500">*</span>
					</h6>

					<Textbox
						type="text"
						bind:value="{data.ads.address}"
						placeholder="Enter Address"
						required />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Landmark <span class="text-red-500">*</span></h6>

					<Textbox
						type="text"
						bind:value="{data.ads.locality}"
						placeholder="Enter Landmark"
						required />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">City/District/Town <span class="text-red-500">*</span></h6>

					<Textbox type="text" bind:value="{data.ads.city}" placeholder="Enter City" required />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">State <span class="text-red-500">*</span></h6>

					<Textbox type="text" bind:value="{data.ads.state}" placeholder="Enter State" required />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Country <span class="text-red-500">*</span></h6>

					<Textbox
						type="text"
						bind:value="{data.ads.country}"
						placeholder="Enter Country"
						required />
				</div>

				<div>
					<h6 class="mb-2 font-semibold">Pincode / Zip <span class="text-red-500">*</span></h6>

					<Textbox
						type="text"
						bind:value="{data.ads.zip}"
						placeholder="Enter Pincode / Zip"
						required />
				</div>
			</div>

			<div class="mt-5 flex justify-end sm:mt-10">
				<PrimaryButton type="submit" loading="{loading}" class="px-10">SAVE ADDRESS</PrimaryButton>
			</div>
		</form>
	</div>
{/if}
