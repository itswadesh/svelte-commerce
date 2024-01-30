<style></style>

<script>
import { goto } from '$app/navigation'

import { store } from '$lib/store'
import { PrimaryButton } from '$lib/ui'
import { page } from '$app/stores'
import dayjs from 'dayjs'
import { toast } from '$lib/utils'
import { onMount } from 'svelte'
import Modal from './_Modal.svelte'
import { createEventDispatcher } from 'svelte'
import { post } from '$lib/utils/api'
import { DemoRequestService } from '$lib/services'
import { services } from '@misiki/litekart-utils'
const dispatch = createEventDispatcher()

export let product,
	show = false

let minDate = null,
	loading = false,
	isDisabled = false,
	schedule = {
		id: 'new',
		title: 'Product demo request',
		scheduleDateTime: null
	}
let clazz
export { clazz as class }
onMount(async () => {
	const now = dayjs()
	const tomorrow = dayjs().add(1, 'day')
	const nextMonth = dayjs().add(30, 'day').format('YYYY-MM-DDTHH:mm')
	schedule.scheduleDateTime = tomorrow.format('YYYY-MM-DDTHH:mm')
	minDate = tomorrow.format('YYYY-MM-DDTHH:mm')
	if (product) {
		schedule.product = product.id
		schedule.title = `Schedule product demo request for ${product && product.name}`
	}
})

async function submit() {
	const msg = 'Schedule Done !'
	loading = true
	try {
		await services.DemoRequestService.saveScheduleDemo({
			schedule,
			storeId: $page?.data?.storeId,
			origin: $page.data.origin
		})
		toast(msg, 'success')
		goto(`/my/demo-requests`)
	} catch (e) {
		toast(e, 'error')
	} finally {
		loading = false
		dispatch('hide', true)
	}
}

function success() {}
function setErr() {}
function hide(e) {
	if (e) goto(`/c/${e}`)
	dispatch('hide', true)
}
</script>

<div class="{clazz}">
	<Modal
		class=""
		isVisible="{show}"
		on:cancel="{() => {
			show = false
		}}"
		on:confirm="{() => {
			show = false
		}}">
		<p>Schedule Live Demo</p>

		{#if minDate}
			<form novalidate autocomplete="off" class="max-w-sm" on:submit|preventDefault="{submit}">
				<p class="mb-5">
					Schedule product demo request for {product && product.name}
				</p>

				<input
					id="demo-time"
					bind:value="{schedule.scheduleDateTime}"
					type="datetime-local"
					name="demo-time"
					min="minDate"
					max="nextMonth"
					class="
					mb-5
					w-full
					rounded
					border
					border-zinc-200
					bg-zinc-50
					p-2
					text-sm
					font-light
					placeholder-zinc-400
					transition
					duration-300 hover:bg-white
					focus:outline-none focus:ring-0 focus:ring-offset-0
					" />

				<PrimaryButton disabled="{isDisabled}" {loading} class="w-full" type="submit">
					Schedule
				</PrimaryButton>
			</form>
		{/if}
	</Modal>
</div>
