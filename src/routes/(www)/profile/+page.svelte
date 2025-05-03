<script lang="ts">
	import { onMount } from 'svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { userService } from '$lib/core/services'
	import { goto } from '$app/navigation'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	// import ImageUpload from '$lib/components/image-upload.svelte'
	import { toast } from 'svelte-sonner'
	import { Save, ArrowLeft, InfoIcon, Loader, FileChartColumnIncreasing } from 'lucide-svelte'
	import { browser } from '$app/environment'
	import Textbox from '$lib/components/form/textbox.svelte'
	import { z } from 'zod'

	let user: any = $state({})
	let isLoading = $state(false)
	let detailsChanged = $state(false)

	const schemas = {
		firstName: z.string().min(2, 'First name must be at least 2 characters'),
		lastName: z.string().min(2, 'Last name must be at least 2 characters'),
		email: z.string().email('Please enter a valid email address'),
		phone: z
			.string()
			.regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
			.min(9, 'Please enter a valid phone number')
	}

	const mount = async () => {
		if (browser) {
			document.onkeydown = function (e) {
				e = e || window.event
				if (e.ctrlKey || e.metaKey) {
					// Check for both Ctrl and Command key
					var c = e.which || e.keyCode // Get key code
					switch (c) {
						case 83: // Block Ctrl/Cmd + S
							e.preventDefault()
							e.stopPropagation()
							handleUpdate()
							break
					}
				}
			}
		}
		try {
			user = await userService.getMe()
		} catch (e) {
			console.log(e)
		}
	}

	$effect(() => {
		mount()
	})

	// onMount()

	const handleUpdate = async () => {
		try {
			isLoading = true
			user = await userService.updateProfile(user)
			goto('/profile')
		} catch (e: any) {
			toast.error(e.message)
		} finally {
			isLoading = false
			detailsChanged = false
		}
	}

	const handleDetailsChange = () => {
		detailsChanged = true
	}

	const onUploadComplete = (urls: string[]) => {
		user.avatar = urls[0]
		handleDetailsChange()
	}
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>
<div class="flex min-h-screen items-center justify-center">
	<div class="w-full max-w-md transform space-y-6 rounded-xl bg-white p-8 shadow-2xl transition-all dark:bg-gray-800">
		<div class="space-y-2 text-center">
			<p class="text-gray-500 dark:text-gray-400">Update Profile Details</p>
		</div>
		<form onsubmit={handleUpdate} class="grid grid-cols-2 gap-4" oninput={handleDetailsChange}>
			<!-- Image Upload - occupies the full width of the first row -->
			<div class="col-span-2">
				<h2 class="text-1xl font-bold text-gray-900 dark:text-white">Avatar:</h2>
				<div class="mt-3 flex w-full flex-row items-center justify-start">
					<!-- <ImageUpload {onUploadComplete} single /> -->
					<LazyImg src={user.avatar} alt={`Avatar Image`} width={70} height={70} class="ml-5 rounded-lg" />
				</div>
			</div>

			<!-- First Name Input -->
			<Textbox
				name="firstName"
				bind:value={user.firstName}
				placeholder="Enter Your First Name"
				schema={schemas.firstName}
				label="First Name"
				required
			/>

			<!-- Last Name Input -->
			<Textbox name="lastName" bind:value={user.lastName} placeholder="Enter Your Last Name" schema={schemas.lastName} label="Last Name" required />

			<!-- Email Input -->
			<Textbox name="email" type="email" bind:value={user.email} placeholder="Enter Your Email" schema={schemas.email} label="Email" required />

			<!-- Phone Input -->
			<Textbox name="phone" type="tel" bind:value={user.phone} placeholder="+1234567890" schema={schemas.phone} label="Phone" required />

			<!-- Update Button, full-width across both columns -->
			<div class="col-span-2">
				<Button
					disabled={isLoading}
					onclick={handleUpdate}
					type="submit"
					class="flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
				>
					{#if isLoading}
						<Loader class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Update Profile
				</Button>
			</div>
		</form>
	</div>
</div>
<div
	class="ease-[cubic-bezier(1,.32,.52,.67)] fixed left-0 right-0 top-10 z-50 mx-auto flex w-1/2 max-w-[1000px] flex-row justify-between rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs font-semibold text-black shadow transition-all duration-150 hover:bg-gray-100"
	style={detailsChanged ? 'display: flex' : 'display: none'}
>
	<div class="flex flex-row items-center gap-2">
		<InfoIcon class="h-4 w-4" />
		<span>Unsaved changes</span>
	</div>
	<button onclick={handleUpdate} class="rounded bg-white px-2 py-1 text-xs text-black shadow">
		{#if isLoading}
			<Loader class="h-4 w-4 animate-spin" />
		{:else}
			Save
		{/if}
	</button>
</div>
