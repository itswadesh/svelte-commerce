<script>
import { onMount, onDestroy } from 'svelte'
import { readable } from 'svelte/store'

export let startTimeISO
export let endTimeISO

let countdownStore

const calculateTimeLeft = () => {
	const now = new Date()
	const startTime = new Date(startTimeISO)
	const endTime = new Date(endTimeISO)

	let timeLeft = {}

	if (now < startTime) {
		timeLeft = calculateTimeDifference(now, startTime)
	} else if (now >= startTime && now <= endTime) {
		timeLeft = calculateTimeDifference(now, endTime)
	} else {
		timeLeft = null
	}

	return timeLeft
}

const calculateTimeDifference = (start, end) => {
	const difference = end - start
	const days = Math.floor(difference / (1000 * 60 * 60 * 24))
	const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
	const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
	const seconds = Math.floor((difference % (1000 * 60)) / 1000)

	return { days, hours, minutes, seconds }
}

onMount(() => {
	countdownStore = readable(calculateTimeLeft(), (set) => {
		const intervalId = setInterval(() => {
			const timeLeft = calculateTimeLeft()
			if (timeLeft === null) {
				clearInterval(intervalId)
			}
			set(timeLeft)
		}, 1000)

		return () => {
			clearInterval(intervalId)
		}
	})
})

onDestroy(() => {
	countdownStore = null
})
</script>

{#if $countdownStore !== null}
	{#if $countdownStore}
		<div class="relative border-2 border-secondary-500 rounded p-5">
			<div class="absolute top-0 inset-x-0 flex items-center justify-center">
				<h6 class="bg-white p-1 -mt-4">Offer ends in...</h6>
			</div>

			<div class="flex itmes-center gap-5 text-secondary-500 uppercase">
				{#if $countdownStore.days > 0}
					<div class="flex flex-col">
						<h2 class="w-8">{$countdownStore.days}</h2>

						<span class="text-xs">Days</span>
					</div>
				{/if}

				<div class="flex flex-col">
					<h2 class="w-8">{$countdownStore.hours}</h2>

					<span class="text-xs">Hrs</span>
				</div>

				<div class="flex flex-col">
					<h2 class="w-8">{$countdownStore.minutes}</h2>

					<span class="text-xs">Min</span>
				</div>

				<div class="flex flex-col">
					<h2 class="w-8">{$countdownStore.seconds}</h2>

					<span class="text-xs">Sec</span>
				</div>
			</div>
		</div>
	{:else}
		<p>Deal has ended.</p>
	{/if}
{:else}
	<p>Deal has not started yet.</p>
{/if}
