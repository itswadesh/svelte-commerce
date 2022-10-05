<style>
.frosted {
	backdrop-filter: blur(12px);
	background-color: hsla(0, 0%, 100%, 0.3);
}
</style>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import { toast } from '$lib/util'
import SingleImageUpload from '$lib/SingleImageUpload.svelte'
import Textbox from '$lib/ui/Textbox.svelte'
import Skeleton from '$lib/ui/Skeleton.svelte'
import dayjs from 'dayjs'
import { put } from '$lib/util/api'
import CtrlS from '$lib/components/CtrlS.svelte'
import Cookie from 'cookie-universal'
import { page } from '$app/stores'

export let data

const seoProps = {
	title: 'Dashboard - Edit Profile ',
	description: 'Edit the profile credentials'
}

const cookies = Cookie()

let loading = false
let formChanged = false
let err = ''

function saveImage(detail) {
	data.profile.avatar = detail
	saveProfile()
}

function removeImage(detail) {
	data.profile.avatar = ''
	saveProfile()
}

async function saveProfile() {
	try {
		let e = { ...data.profile }
		e.company = 1
		e.store = data.store?.id
		toast('Saving Profile Info...', 'warning')
		if (e.dob) e.dob = dayjs(e.dob).format('YYYY-MM-DDTHH:mm')
		else e.dob = null
		delete e.phone
		data.profile = await put('users/update-profile', e)

		if (data.profile) {
			data.profile.dob = data.profile.dob ? dayjs(data.profile.dob).format('YYYY-MM-DD') : null
			formChanged = false
			toast('Profile Info Saved.', 'success')
		}

		await cookies.set('me', data.profile, { path: '/' })
		// $page.data.me = data.profile
		// refreshData()
	} catch (e) {
		err = e
		toast(e, 'error')
	} finally {
		// loading = false
	}
}
</script>

<SEO {...seoProps} />

<div class="max-w-3xl text-gray-800">
	<header class="mb-5">
		<h1 class="font-serif text-2xl font-medium md:text-3xl lg:text-4xl">Profile Details</h1>
	</header>

	{#if loading}
		<div class="flex flex-col gap-5">
			<Skeleton />
			<Skeleton />
			<Skeleton />
		</div>
	{:else if data.profile}
		<div>
			<form class="mb-5 flex flex-col gap-4 sm:mb-10" on:submit|preventDefault="{saveProfile}">
				<div>
					<div
						class="frosted flex flex-col gap-2 rounded-lg border border-gray-300 p-4 shadow-lg md:p-6">
						<div class="flex flex-wrap items-center">
							<div class="mb-1 mr-5 w-52 flex-shrink-0 font-medium"></div>

							<div class="mb-2 w-full max-w-md">
								<span class="mb-1 text-sm font-medium sm:text-lg lg:text-xl">
									{data.profile.email || ''} <br />
								</span>

								<span class="text-xs capitalize sm:text-sm">
									Role : <b>{data.profile.role || ''}</b>
								</span>
							</div>
						</div>

						<div class="flex flex-wrap">
							<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">First Name</h6>

							<div class="mb-2 w-full max-w-md">
								<Textbox
									type="text"
									placeholder="Enter First Name"
									bind:value="{data.profile.firstName}"
									on:input="{() => (formChanged = true)}" />
							</div>
						</div>

						<div class="flex flex-wrap">
							<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Last Name</h6>

							<div class="mb-2 w-full max-w-md">
								<Textbox
									type="text"
									placeholder="Enter Last Name"
									bind:value="{data.profile.lastName}"
									on:input="{() => (formChanged = true)}" />
							</div>
						</div>

						<div class="flex flex-wrap">
							<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Date Of Birth</h6>

							<div class="mb-2 w-full max-w-md">
								<Textbox
									type="date"
									placeholder="Enter Date Of Birth"
									bind:value="{data.profile.dob}"
									on:input="{() => (formChanged = true)}" />
							</div>
						</div>

						<div class="flex flex-wrap">
							<h6 class="mb-1 mr-5 w-52 flex-shrink-0 font-medium">Phone</h6>

							<div class="mb-2 w-full max-w-md">
								<Textbox
									disabled
									type="text"
									placeholder="Eg: +91000000000"
									bind:value="{data.profile.phone}"
									on:input="{() => (formChanged = true)}" />
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	{/if}
</div>

<CtrlS
	loading="{loading}"
	loadingMessage="Updating Profile"
	formChanged="{formChanged}"
	on:save="{() => saveProfile()}" />
