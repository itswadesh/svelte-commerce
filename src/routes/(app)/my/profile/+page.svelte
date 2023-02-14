<style>
.frosted {
	backdrop-filter: blur(12px);
	background-color: hsla(0, 0%, 100%, 0.3);
}
</style>

<script>
import { page } from '$app/stores'
import { put } from '$lib/utils/api'
import { toast } from '$lib/utils'
import Cookie from 'cookie-universal'
import CtrlS from '$lib/components/CtrlS.svelte'
import dayjs from 'dayjs'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import SingleImageUpload from '$lib/SingleImageUpload.svelte'
import Skeleton from '$lib/ui/Skeleton.svelte'
import Textbox from '$lib/ui/Textbox.svelte'

export let data

const seoProps = {
	title: 'Dashboard - Edit Profile ',
	description: 'Edit the profile credentials'
}

const cookies = Cookie()
let loading = false
let err = ''

function saveImage(detail) {
	// console.log('detail = ', detail)

	data.profile.avatar = detail
	saveProfile()
}

function removeImage(detail) {
	// console.log('detail = ', detail)

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
		data.profile = await put('users/update-profile', e, $page.data.origin)

		if (data.profile) {
			data.profile.dob = data.profile.dob ? dayjs(data.profile.dob).format('YYYY-MM-DD') : null

			toast('Profile Info Saved.', 'success')
		}

		await cookies.set('me', data.profile, { path: '/' })
		// $page.data.me = data.profile
		// refreshData()
	} catch (e) {
		err = e
		toast(e, 'error')
	} finally {
	}
}
</script>

<SEO {...seoProps} />

<div class="max-w-3xl">
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
						class="frosted flex flex-col gap-4 rounded-lg border border-gray-300 p-4 shadow-lg md:p-6"
					>
						<div class="flex flex-wrap items-center gap-2">
							<div class="w-52 shrink-0 font-medium">
								<SingleImageUpload
									class=""
									avatar
									folder="avatar/{data.profile?.phone?.replace('+', '')}"
									images="{data.profile.avatar}"
									loading="{loading}"
									on:save="{({ detail }) => saveImage(detail)}"
									on:remove="{({ detail }) => removeImage(detail)}"
								/>
							</div>

							<div class="w-full max-w-md">
								{#if data.profile.email}
									<span class="mb-1 text-sm font-medium sm:text-lg lg:text-xl">
										{data.profile.email} <br />
									</span>
								{/if}

								<span class="text-xs capitalize sm:text-sm">
									Role : <b>{data.profile.role || '_'}</b>
								</span>
							</div>
						</div>

						<div class="flex flex-wrap gap-2">
							<h6 class="w-52 shrink-0 font-medium">First Name</h6>

							<div class="w-full max-w-md">
								<Textbox
									type="text"
									placeholder="Enter First Name"
									bind:value="{data.profile.firstName}"
								/>
							</div>
						</div>

						<div class="flex flex-wrap gap-2">
							<h6 class="w-52 shrink-0 font-medium">Last Name</h6>

							<div class="w-full max-w-md">
								<Textbox
									type="text"
									placeholder="Enter Last Name"
									bind:value="{data.profile.lastName}"
								/>
							</div>
						</div>

						<div class="flex flex-wrap gap-2">
							<h6 class="w-52 shrink-0 font-medium">Date Of Birth</h6>

							<div class="w-full max-w-md">
								<Textbox
									type="date"
									placeholder="Enter Date Of Birth"
									bind:value="{data.profile.dob}"
								/>
							</div>
						</div>

						<div class="flex flex-wrap gap-2">
							<h6 class="w-52 shrink-0 font-medium">Phone</h6>

							<div class="w-full max-w-md">
								<Textbox
									disabled
									type="tel"
									maxlength="10"
									placeholder="Eg:xxxxxxxxxx"
									bind:value="{data.profile.phone}"
								/>
							</div>
						</div>
					</div>
				</div>

				<PrimaryButton type="submit" class="w-60">Save Profile</PrimaryButton>
			</form>
		</div>
	{/if}
</div>
