<style>
.clock__wrapper {
	display: flex;
	align-items: center;
	gap: 3px;
	margin-bottom: 3px;
	/* margin-left: 5px; */
}

.clock__data {
	display: flex;
	align-items: center;
	gap: 3px;
}

.text-center {
	text-align: center;
}

.text-white {
	color: white;
}

.fs-3 {
	font-size: 1.5rem;
}

.fs-6 {
	font-size: 0.75rem;
}
</style>

<script>
import { onMount, onDestroy } from 'svelte'

let days, hours, minutes, seconds
let interval

const countDown = () => {
	let dest = new Date('May 30,2023').getTime()
	interval = setInterval(() => {
		const now = new Date().getTime()
		const diff = dest - now
		days = Math.floor(diff / (1000 * 60 * 60 * 24))
		hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
		minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
		seconds = Math.floor((diff % (1000 * 60)) / 1000)

		if (dest < 0) clearInterval(interval)
	}, 1000)
}

onMount(() => {
	countDown()
})

// onDestroy(() => {
//   clearInterval(interval);
// });
</script>

<div class="clock__wrapper bg-slate-900 flex flex-col h-56 mt-8">
	<h2 class="text-white mt-8">Grab Best Deals</h2>
	<div class="flex gap-8 ml-8">
		<div class="clock__data flex flex-col">
			<div class="text-center flex">
				<h1 class="text-white fs-3 mb-2">{days}</h1>
				<span class="text-white fs-3 ml-2">:</span>
			</div>
			<h5 class="text-white fs-6">Days</h5>
		</div>
		<div class="clock__data flex flex-col">
			<div class="text-center flex">
				<h1 class="text-white fs-3 mb-2">{hours}</h1>
				<span class="text-white fs-3 ml-2">:</span>
			</div>
			<h5 class="text-white fs-6">Hours</h5>
		</div>
		<div class="clock__data flex flex-col">
			<div class="text-center flex">
				<h1 class="text-white fs-3 mb-2">{minutes}</h1>
				<span class="text-white fs-3 ml-2">:</span>
			</div>
			<h5 class="text-white fs-6">Minutes</h5>
		</div>
		<div class="clock__data flex flex-col">
			<div class="text-center flex">
				<h1 class="text-white fs-3 mb-2">{seconds}</h1>
			</div>
			<h5 class="text-white fs-6">Seconds</h5>
		</div>
	</div>
	<button class="text-black mt-8 bg-white p-2 rounded-lg">Visit Store</button>
</div>
