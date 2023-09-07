<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
input[type='number'] {
	-moz-appearance: textfield; /* Firefox */
}
</style>

<script lang="ts">
import { browser } from '$app/environment'
import { createEventDispatcher, tick } from 'svelte'
import { enhance } from '$app/forms'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { toast } from '$lib/utils'
import { tweened } from 'svelte/motion'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'

const dispatch = createEventDispatcher()

export let loading
export let phone
export let resendAfter

// $: console.log('resendAfter', resendAfter)

$: timer = tweened(resendAfter)

let disabledBtn = true
let formattedOTP = null
let notACompleteOTP = true
let otp = [
	{ id: 0, value: '' },
	{ id: 1, value: '' },
	{ id: 2, value: '' },
	{ id: 3, value: '' }
]
let ref = $page.url.searchParams.get('ref')

setInterval(() => {
	if ($timer > 0) $timer--
}, 1000)

$: minutes = Math.floor($timer / 60)
$: seconds = Math.floor($timer - minutes * 60)

$: if ($timer == 0) {
	disabledBtn = false
}

// const callMyCount = () => {
// 	var myTimer = setInterval(startTimer, 1000)

// 	function startTimer() {
// 		var presentTime = resendAfter
// 		var timeArray = presentTime.split(/[:]+/)
// 		var m = parseInt(timeArray[0])
// 		var s = checkSecond(parseInt(timeArray[1]) - 1)
// 		if (s == 59) {
// 			m = m - 1
// 		}
// 		if (m < 0 && s == 59) {
// 			alert('Timeout for otp')
// 			clearTimeout(myTimer)
// 		}
// 		resendAfterInMinutes = m + ':' + s
// 	}

// 	function checkSecond(sec) {
// 		if (sec < 10 && sec >= 0) {
// 			sec = '0' + sec
// 		}
// 		if (sec < 0) {
// 			sec = '59'
// 		}
// 		return sec
// 	}
// }

function handleResendOtp() {
	otp = [
		{ id: 0, value: '' },
		{ id: 1, value: '' },
		{ id: 2, value: '' },
		{ id: 3, value: '' }
	]
	formattedOTP = null
	dispatch('resend', phone)
}

export const handlePaste = async (event) => {
	event.preventDefault()

	// console.log(
	// 	'event.clipboardData || window.clipboardData',
	// 	event.clipboardData || window.clipboardData
	// )

	// alert(event.target.value.length)
	// console.log(event.target.value, event.target.value.length, event);

	// alert(event.data.length)

	// const text =  await navigator.clipboard.readText();

	const clipboardData = event.clipboardData || window.clipboardData
	const pastedText = clipboardData.getData('text')

	otp = [
		{ id: 0, value: pastedText[0] },
		{ id: 1, value: pastedText[1] },
		{ id: 2, value: pastedText[2] },
		{ id: 3, value: pastedText[3] }
	]

	updateOTP()

	// Call any function to handle the pasted text here
	// For example: handlePastedText(pastedText);
}

function handleInput(index, event) {
	// console.log(navigator)

	otp[index].value = event.target.value
	const value = event.target.value
	if (value.length > 1) {
		otp[index].value = value[value.length - 1]
	} else {
		otp[index].value = value
	}

	if (index < otp.length - 1 && value) {
		const nextInput = event.target.nextElementSibling
		if (nextInput) {
			nextInput.focus()
		}
	} else if (!value && index > 0) {
		const prevInput = event.target.previousElementSibling
		if (prevInput) {
			prevInput.focus()
		}
	}

	// console.log('otp', otp)
	updateOTP()
}

function handleClear(index, event) {
	if ((event.key === 'Backspace' || event.key === 'Delete') && index > 0) {
		const prevInput = event.target.previousElementSibling
		if (prevInput) {
			otp[index].value = '' // Clear the current input value
			prevInput.value = '' // Clear the previous input value
			prevInput.focus() // Focus on the previous input
		}
		event.preventDefault() // Prevent the default behavior of the Backspace and Delete keys
		updateOTP()
	}
}

async function updateOTP() {
	const formattedOTPValues = otp.map((elm) => {
		return elm.value
	})

	formattedOTP = formattedOTPValues.join('')

	if (formattedOTP?.length === 4) {
		// console.log('your otp is', formattedOTP)
		// console.log(formattedOTP)

		notACompleteOTP = false

		// dispatch('verifyOtp', formattedOTP)
		await tick()
		const form = document.querySelector('#otp-form')

		form.dispatchEvent(new Event('submit'))
	}
}

// function handleAutoSubmit() {

// }
</script>

<div>
	<div class="mb-5 flex flex-col items-center justify-center gap-1 text-center">
		<div class="text-sm">Enter the OTP sent to</div>

		<div class="flex gap-2 text-xs">
			<b>{phone || 'No phone no found'} </b>

			<button
				type="button"
				class="font-bold focus:outline-none cursor-pointer hover:text-blue-600"
				on:click="{() => dispatch('changeNumber')}">
				Change
			</button>
		</div>
	</div>

	<form
		action="/auth/login?/verifyOtp"
		method="POST"
		use:enhance="{() => {
			return async ({ result }) => {
				if (result?.status === 200) {
					goto(ref || '/')
				} else {
					toast(result?.data?.message, 'error')
					otp = [
						{ id: 0, value: '' },
						{ id: 1, value: '' },
						{ id: 2, value: '' },
						{ id: 3, value: '' }
					]
					document.getElementById('otpbox_0').focus()
				}
			}
		}}"
		class="mb-8 flex flex-col items-center justify-center text-center"
		id="otp-form">
		<!-- on:submit|preventDefault="{handleOtp}" -->
		<!-- <div class="mb-5 flex items-center justify-center gap-5"> -->
		<!-- <div class="flex items-center justify-center gap-2">
				<input
					bind:value="{otp1}"
					type="tel"
					id="first"
					maxlength="1"
					class="flex h-12 w-12 items-center justify-center rounded border bg-white text-center text-xl font-semibold shadow-md ring-2 ring-white ring-transparent focus:outline-none focus:ring-primary-500"
					on:keyup="{() => clickEvent('first', 'second')}" />

				<input
					bind:value="{otp2}"
					type="tel"
					id="second"
					maxlength="1"
					class="flex h-12 w-12 items-center justify-center rounded border bg-white text-center text-xl font-semibold shadow-md ring-2 ring-white ring-transparent focus:outline-none focus:ring-primary-500"
					on:keyup="{() => clickEvent('second', 'third')}" />

				<input
					bind:value="{otp3}"
					type="tel"
					id="third"
					maxlength="1"
					class="flex h-12 w-12 items-center justify-center rounded border bg-white text-center text-xl font-semibold shadow-md ring-2 ring-white ring-transparent focus:outline-none focus:ring-primary-500"
					on:keyup="{() => clickEvent('third', 'fourth')}" />

				<input
					bind:value="{otp4}"
					type="tel"
					id="fourth"
					maxlength="1"
					class="flex h-12 w-12 items-center justify-center rounded border bg-white text-center text-xl font-semibold shadow-md ring-2 ring-white ring-transparent focus:outline-none focus:ring-primary-500"
					on:keyup="{() => clickEvent('fourth', '')}" />
			</div> -->
		<!-- </div> -->

		<div class="mb-5 flex gap-x-2">
			{#each otp as { id, value }, index (id)}
				<input
					id="otpbox_{id.toString()}"
					class="w-12 h-12 text-center border focus:outline-none focus:border-zinc-500 focus:ring-1 ring-zinc-800 rounded"
					type="number"
					maxlength="1"
					value="{value}"
					autofocus="{index === 0 ? true : false}"
					on:input="{(event) => handleInput(index, event)}"
					on:paste="{handlePaste}"
					on:keydown="{(event) => handleClear(index, event)}"
					key="{id}" />
			{/each}
		</div>

		<input type="hidden" name="phone" value="{phone}" />

		<input type="hidden" name="otp" value="{formattedOTP}" />

		<!-- <div class="otp-input-wrapper mx-auto mb-5 max-w-max">
			<input
				type="tel"
				name="otp"
				bind:value="{otp}"
				maxlength="4"
				pattern="[0-9]*"
				autocomplete="off"
				autofocus="{true}"
				on:input="{checkLength}"
				on:keypress="{onKeyPress}" />


			<svg viewBox="0 0 240 1" xmlns="http://www.w3.org/2000/svg">
				<line
					x1="0"
					y1="0"
					x2="240"
					y2="0"
					stroke="#3e3e3e"
					stroke-width="2"
					stroke-dasharray="44,22"></line>
			</svg>
		</div> -->

		<p class="mb-2">Didn't receive the OTP?</p>

		<div class="mb-5 text-sm">
			{#if (minutes || seconds) && (minutes >= 0 || seconds >= 0)}
				<div class="mx-auto flex max-w-max items-center gap-1">
					<span>Resend OTP in</span>

					<p class="flex items-center justify-center">
						<span>
							{#if minutes < 10} 0{minutes} {:else} {minutes}{/if}
						</span>

						<span>:</span>

						<span>
							{#if seconds < 10}0{seconds}{:else}{seconds}{/if}
						</span>
					</p>

					<span>seconds</span>
				</div>
			{:else}
				<button
					type="button"
					class="font-bold text-primary-500 focus:outline-none hover:text-primary-700"
					on:click="{handleResendOtp}">
					RESEND OTP
				</button>
			{/if}
		</div>

		<PrimaryButton
			type="submit"
			loading="{loading}"
			disabled="{notACompleteOTP || loading}"
			class="w-full">VERIFY</PrimaryButton>
	</form>
</div>
