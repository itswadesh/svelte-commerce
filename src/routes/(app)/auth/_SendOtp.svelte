<script>
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import TextboxFloating from '$lib/ui/TextboxFloating.svelte'
import { createEventDispatcher } from 'svelte'
import { onMount } from 'svelte'

const dispatch = createEventDispatcher()

export let phone, loading
export let ref = null
// onMount(() => {
// 	ref.focus()
// })
</script>

<form class="mb-5 flex flex-col gap-5" on:submit|preventDefault="{() => dispatch('send', phone)}">
	<div>
		<div class="mb-1 flex items-baseline gap-1">
			<span class="text-sm"> +91 </span>

			<TextboxFloating
				bind:this="{ref}"
				type="tel"
				label="Mobile Number"
				maxlength="10"
				class="w-full"
				required
				bind:value="{phone}" />
		</div>

		<p class="text-sm font-light text-gray-500">Ex. 9XXXXXXXXX</p>
	</div>

	<PrimaryButton loading="{loading}" class="w-full" type="submit">SEND OTP</PrimaryButton>
</form>
