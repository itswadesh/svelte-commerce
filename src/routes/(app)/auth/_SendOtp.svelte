<script>
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import TextboxFloating from '$lib/ui/TextboxFloating.svelte'
import { createEventDispatcher } from 'svelte'
import { onMount } from 'svelte'

const dispatch = createEventDispatcher()

export let phone, loading, store
export let ref = null
// onMount(() => {
// 	ref.focus()
// })
</script>

<div>
	<h6 class="mb-3 text-center text-gray-600">Please Enter Mobile Number</h6>

	<form class="mb-8" on:submit|preventDefault="{() => dispatch('send', phone)}">
		<div class="flex items-baseline gap-1">
			<span class="text-sm"> +91 </span>

			<TextboxFloating
				bind:this="{ref}"
				type="tel"
				label="Mobile Number"
				class="mb-1 w-full"
				required
				bind:value="{phone}" />
		</div>

		<p class="mb-5 text-sm font-light text-gray-500">Ex. 9XXXXXXXXX</p>

		<PrimaryButton loading="{loading}" class="w-full" type="submit">SEND OTP</PrimaryButton>
	</form>
</div>
