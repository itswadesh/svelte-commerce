<style>
.slowtransition {
	animation: fade 0.5s;
}

@keyframes fade {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}
</style>

<script>
import { createEventDispatcher } from 'svelte'
import { toast } from './utils'

const dispatch = createEventDispatcher()

export let images,
	title = 'Upload File',
	folder = 'img',
	maxSize = null,
	multi = false,
	avatar = false,
	accept = 'image/*',
	loading = false

let uploading = false,
	files,
	deleting = false

let clazz = ''

export { clazz as class }

async function remove(img) {
	try {
		deleting = true
		const response = await fetch('/server/files/delete', {
			method: 'POST',
			headers: { 'content-type': 'application/json', url: img }
		})
		const isJson = response.headers.get('content-type')?.includes('application/json')
		const res = isJson ? await response.json() : await response.text()
		// const data = await fetch(`/api/delete-file`, { url: img }) //supabase.storage.from(folder).remove([imageObject])
		if (response.status > 299) throw res
		else dispatch('remove', res)
	} catch (e) {
		toast(e, 'error')
	} finally {
		deleting = false
	}
}

const handleSubmit = async (e) => {
	var isOk = true
	const maxSize = 10 * 1000 * 1000 // 2MB
	const file = e //e.target.files[0]
	isOk = file.size > maxSize ? false : true
	if (!isOk) {
		toast('File size is too big', 'error')
		return
	}
	try {
		loading = true
		const response = await fetch('/server/files/upload', {
			method: 'POST',
			body: file,
			headers: { folder, 'Content-Type': 'image/png' }
		})
		const res = await response.json()
		dispatch('save', res?.url)
	} catch (e) {
	} finally {
		loading = false
	}
}
</script>

<div
	class="{clazz} group relative h-36 w-36 flex-shrink-0 flex-grow-0 bg-gray-50 transition duration-300 hover:bg-white">
	{#if !uploading && !deleting && images != '' && images !== undefined}
		<div
			class="slowtransition absolute inset-0 z-0 hidden items-center justify-center bg-black bg-opacity-50 text-center group-hover:flex">
			<span class="font-medium text-white">Click to Update</span>
		</div>

		<button
			type="button"
			title="delete"
			class="hover:text-graey-800 absolute right-0 top-0 z-20 -m-2 hidden rounded-full border bg-white p-1 text-gray-500 shadow-md transition duration-300 focus:outline-none group-hover:flex hover:bg-gray-200"
			on:click="{() => remove(images)}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 "
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"></path>
			</svg>
		</button>
	{/if}

	<div>
		{#if uploading || deleting || loading}
			<div
				class="absolute inset-0 z-10 flex h-36 w-36 items-center justify-center bg-black bg-opacity-50 text-center text-sm font-medium text-white">
				<div
					class="absolute inset-0 flex h-36 w-36 items-center justify-center bg-black bg-opacity-50 text-center text-sm font-medium text-white">
					{#if uploading}
						<span>Loading, Please wait...</span>
					{:else if deleting}
						<span>Deleting, Please wait...</span>
					{:else if deleting}
						<span>Loading, Please wait...</span>
					{/if}
				</div>
			</div>
		{:else if images != '' && images != undefined}
			<div class="h-36 w-36 border-2 border-gray-300 bg-white text-xs">
				<embed
					src="{images}"
					frameBorder="0"
					scrolling="auto"
					height="100%"
					width="100%"
					class="object-contain object-center" />
			</div>
		{:else if avatar}
			<div
				class="flex h-36 w-36 items-center justify-center border-2 border-gray-300 bg-gray-100 p-1">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="h-full w-full text-gray-300">
					<path
						fill-rule="evenodd"
						d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
						clip-rule="evenodd"></path>
				</svg>
			</div>
		{:else}
			<div
				class="absolute inset-0 z-0 flex flex-col items-center justify-center border border-dashed border-indigo-500 text-center text-sm text-indigo-500 transition duration-300 group-hover:border-indigo-800 group-hover:text-indigo-800">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mb-5 h-8 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
					></path>
				</svg>

				<span>{title}</span>
			</div>
		{/if}

		<input
			bind:files
			on:change="{() => handleSubmit(files[0])}"
			class="absolute inset-0 z-10 h-36 w-36 flex-shrink-0 flex-grow-0 cursor-pointer opacity-0"
			type="file"
			disabled="{uploading || deleting}"
			accept="{accept}"
			max-size="{maxSize}"
			multiple="{multi}" />
	</div>
</div>
