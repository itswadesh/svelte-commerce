<style scoped>
.width {
	min-width: max-content;
}
</style>

<script>
import Textbox from '$lib/ui/Textbox.svelte'
import { toast } from '$lib/util'
import { onMount } from 'svelte'
import { KQL_Me, KQL_UpdateProfile } from '$lib/graphql/_kitql/graphqlStores'

let errors = {},
	valid = true,
	profile = {},
	user = null,
	showImageModal = false
onMount(async () => {
	const userDetails = (await KQL_Me.query()).data?.me
	profile = Object.assign({}, userDetails)
})
function save(profile) {
	try {
		KQL_UpdateProfile.mutate({ variables: profile })
		toast('Profile saved successfullly', 'success')
	} catch (e) {
		toast(e, 'error')
	} finally {
	}
}
</script>

<section class="h-full w-full pb-20 pl-2 tracking-wide text-gray-800 sm:pl-8 sm:pr-2 ">
	<h1 class="text-lg  font-bold sm:text-xl">Profile</h1>

	<div class="mt-2 rounded-sm bg-gray-200 text-gray-800 sm:mt-5">
		<h2 class="border-b border-gray-50 p-4 text-base font-semibold tracking-wider sm:text-lg">
			Edit your profile details
		</h2>
		<form on:submit|preventDefault="{() => save(profile)}" class="py-4">
			<div class="items-center p-2 md:flex">
				<div class="w-full text-sm md:w-3/12 md:px-4">First Name</div>
				<div class="w-full md:w-9/12">
					<div class="mt-2 max-w-sm md:mt-0">
						<Textbox bind:value="{profile.firstName}" on:change="{() => save(profile)}" />
					</div>
				</div>
			</div>
			<div class="items-center p-2 md:flex">
				<div class="w-full text-sm md:w-3/12 md:px-4">Last Name</div>
				<div class="w-full md:w-9/12">
					<div class="mt-2 max-w-sm md:mt-0">
						<Textbox bind:value="{profile.lastName}" on:change="{() => save(profile)}" />
					</div>
				</div>
			</div>
			<div class="p-2 md:flex lg:items-center">
				<div class="w-full text-sm md:w-3/12 md:px-4">State</div>
				<div class="w-full items-center md:w-9/12 lg:flex">
					<div class="mt-2 max-w-sm md:mt-0 md:w-96">
						<Textbox bind:value="{profile.state}" on:change="{() => save(profile)}" />
					</div>
					<!-- <h6 class="my-2 text-xs text-gray-600 lg:ml-5">Username for community forums</h6> -->
				</div>
			</div>
			<div class="p-2 md:flex lg:items-center">
				<div class="w-full text-sm md:w-3/12 md:px-4">City</div>
				<div class="w-full items-center md:w-9/12 lg:flex">
					<div class="mt-2 max-w-sm md:mt-0 md:w-96">
						<Textbox bind:value="{profile.city}" on:change="{() => save(profile)}" />
					</div>
					<!-- <h6 class="my-2 text-xs text-gray-600 lg:ml-5">Username for community forums</h6> -->
				</div>
			</div>
			<div class="p-2 md:flex lg:items-center">
				<div class="w-full text-sm md:w-3/12 md:px-4">Zip / Pincode</div>
				<div class="w-full items-center md:w-9/12 lg:flex">
					<div class="mt-2 max-w-sm md:mt-0 md:w-96">
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
				<div class="w-full text-sm md:w-3/12 md:px-4">Your email</div>
				<div class="w-full md:w-9/12">
					<div class="mt-2 max-w-sm text-xs sm:text-base md:mt-0">
						{profile.email}
					</div>
				</div>
			</div>

			<div class="items-center p-2 pb-5 md:flex">
				<div class="w-full text-sm md:w-3/12 md:px-4"></div>
				<div class="w-full md:w-9/12">
					<div class="mt-2 flex max-w-sm items-center justify-center md:mt-0">
						<button
							class="zoom justify-center rounded-full bg-gray-800 px-6 py-2 text-center text-sm font-semibold uppercase tracking-wider text-white opacity-80 shadow-md transition duration-300 hover:opacity-100 focus:outline-none sm:mt-8 sm:text-base"
							type="submit">Save Profile Details</button>
					</div>
				</div>
			</div>
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
