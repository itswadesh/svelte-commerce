<style scoped>
.width {
	min-width: max-content;
}
</style>

<script>
import Textbox from '$lib/ui/Textbox.svelte'
import { showToast } from './../../../util'
import { me, updateProfile } from './../../../../store/auth'
import { onMount } from 'svelte'
import { goto } from '$app/navigation'

let errors = {},
	valid = true,
	profile = {},
	user = null,
	showImageModal = false
onMount(async () => {
	const userDetails = await me()
	profile = Object.assign({}, userDetails)
})
function save(profile) {
	try {
		// delete profile.address
		console.log(profile)
		updateProfile(profile)
		showToast('Profile saved successfullly', 'success')
		// goto('/')
	} catch (e) {
		showToast(e, 'error')
	} finally {
	}
}
</script>

<section class="px-2 py-12 bg-white lg:px-8">
	<div>
		<h1 class="text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl">Profile</h1>
	</div>
	<div class="mt-8 text-gray-800 bg-gray-200 rounded-sm">
		<h2 class="p-4 text-lg font-semibold tracking-wider border-b border-gray-50">
			Profile name and credentials
		</h2>
		<form on:submit|preventDefault="{() => save(profile)}" class="py-4">
			<div class="items-center p-2 md:flex">
				<div class="w-full text-sm md:px-4 md:w-3/12">First Name</div>
				<div class="w-full md:w-9/12">
					<div class="max-w-sm mt-2 md:mt-0">
						<Textbox bind:value="{profile.firstName}" on:change="{() => save(profile)}" />
					</div>
				</div>
			</div>
			<div class="items-center p-2 md:flex">
				<div class="w-full text-sm md:px-4 md:w-3/12">Last Name</div>
				<div class="w-full md:w-9/12">
					<div class="max-w-sm mt-2 md:mt-0">
						<Textbox bind:value="{profile.lastName}" on:change="{() => save(profile)}" />
					</div>
				</div>
			</div>
			<div class="p-2 md:flex lg:items-center">
				<div class="w-full text-sm md:px-4 md:w-3/12">State</div>
				<div class="items-center w-full lg:flex md:w-9/12">
					<div class="max-w-sm mt-2 md:w-96 md:mt-0">
						<Textbox bind:value="{profile.state}" on:change="{() => save(profile)}" />
					</div>
					<!-- <h6 class="my-2 text-xs text-gray-600 lg:ml-5">Username for community forums</h6> -->
				</div>
			</div>
			<div class="p-2 md:flex lg:items-center">
				<div class="w-full text-sm md:px-4 md:w-3/12">City</div>
				<div class="items-center w-full lg:flex md:w-9/12">
					<div class="max-w-sm mt-2 md:w-96 md:mt-0">
						<Textbox bind:value="{profile.city}" on:change="{() => save(profile)}" />
					</div>
					<!-- <h6 class="my-2 text-xs text-gray-600 lg:ml-5">Username for community forums</h6> -->
				</div>
			</div>
			<div class="p-2 md:flex lg:items-center">
				<div class="w-full text-sm md:px-4 md:w-3/12">Zip / Pincode</div>
				<div class="items-center w-full lg:flex md:w-9/12">
					<div class="max-w-sm mt-2 md:w-96 md:mt-0">
						<Textbox bind:value="{profile.zip}" on:change="{() => save(profile)}" />
					</div>
					<!-- <h6 class="my-2 text-xs text-gray-600 lg:ml-5">Username for community forums</h6> -->
				</div>
			</div>
			<!-- <div class="p-2 md:flex lg:items-center">
				<div class="w-full text-sm md:px-4 md:w-3/12">Country</div>
				<div class="items-center w-full lg:flex md:w-9/12">
					<div class="max-w-sm mt-2 md:w-96 md:mt-0">
						<Textbox bind:value="{profile.country}" on:change="{() => save(profile)}" />
					</div>
				</div>
			</div> -->
			<div class="items-center p-2 md:flex">
				<div class="w-full text-sm md:px-4 md:w-3/12">Your email</div>
				<div class="w-full md:w-9/12">
					<div class="max-w-sm mt-2 md:mt-0">
						<div>{profile.email}</div>
					</div>
				</div>
			</div>
			<button type="submit">Save Profile Details</button>
		</form>
	</div>
	<!-- Your password start  -->
	<!-- <div class="mt-4 text-gray-800 bg-gray-200 rounded-sm">
      <h2
        class="p-4 text-lg font-semibold tracking-wider border-b border-gray-50"
      >
        Your password
      </h2>

      <div class="py-4">
        <div class="flex items-center p-2">
          <div class="w-2/12 pl-4 text-sm">Old password</div>
          <div class="w-10/12">
            <div class="w-96">
              <Textbox v-model="oldPassword" />
            </div>
          </div>
        </div>
        <div class="flex items-center p-2">
          <div class="w-2/12 pl-4 text-sm">New password</div>
          <div class="flex items-center w-10/12">
            <div class="w-96">
              <Textbox v-model="newPassword" />
            </div>
            <span class="ml-5 text-xs text-gray-600">
              The password must be at least 6 characters long</span
            >
          </div>
        </div>
        <div class="flex items-center p-2">
          <div class="w-2/12 pl-4 text-sm">Retype password</div>
          <div class="w-10/12">
            <div class="w-96">
              <Textbox v-model="retypePassword" />
            </div>
          </div>
        </div>
      </div>
    </div> -->
	<!-- Your password end -->
</section>
