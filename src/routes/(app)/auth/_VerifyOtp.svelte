<style>
.frosted {
	background-image: url('/auth/login/bg-lighter.svg');
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
.otp-input-wrapper {
	width: 240px;
	text-align: left;
	display: inline-block;
}
.otp-input-wrapper input {
	padding: 0;
	width: 264px;
	font-size: 32px;
	font-weight: 600;
	color: #3e3e3e;
	background-color: transparent;
	border: 0;
	margin-left: 12px;
	letter-spacing: 48px;
	font-family: sans-serif !important;
}
.otp-input-wrapper input:focus {
	box-shadow: none;
	outline: none;
}
.otp-input-wrapper svg {
	position: relative;
	display: block;
	width: 240px;
	height: 2px;
}
</style>

<script>
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import { createEventDispatcher, onMount } from 'svelte'
import { tweened } from 'svelte/motion'

const dispatch = createEventDispatcher()

export let phone, resendAfter, loading

let otp

// let timer = tweened(resendAfter)
let timer = tweened(resendAfter)

setInterval(() => {
	if ($timer > 0) $timer--
}, 1000)

$: minutes = Math.floor($timer / 60)
$: seconds = Math.floor($timer - minutes * 60)

let otp1 = '',
	otp2 = '',
	otp3 = '',
	otp4 = ''

function clickEvent(current, next) {
	if (next) {
		document.getElementById(next).focus()
	}
}

function handleOtp() {
	otp = otp1 + otp2 + otp3 + otp4

	if (otp.length === 4) {
		// alert(otp)
		dispatch('verifyOtp', otp)
	}
}

function handleResendOtp() {
	otp1 = ''
	otp2 = ''
	otp3 = ''
	otp4 = ''
	otp = otp1 + otp2 + otp3 + otp4
	// alert(otp)
	dispatch('resend', phone)
}

function checkLength(e) {
	if (e.target.value?.length === 4) {
		dispatch('verifyOtp', e.target.value)
	} else {
		return
	}
}
function onKeyPress(e) {
	const value = e.target.value
	if (value.length == 4) return false
}
function onInput(e) {
	// let value = e.target.value
	// value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
}
</script>

<div>
	<div class="mb-5 flex flex-col items-center justify-center gap-1 text-center">
		<div class="text-sm">Enter the OTP sent to</div>

		<div class="flex gap-2 text-xs">
			<b>{phone} </b>

			<button
				type="button"
				class="font-bold text-blue-600 focus:outline-none hover:text-blue-800"
				on:click="{() => dispatch('changeNumber')}"
			>
				Change
			</button>
		</div>
	</div>

	<form class="mb-8 flex flex-col text-center" on:submit|preventDefault="{handleOtp}">
		<div class="otp-input-wrapper mx-auto mb-5 max-w-max">
			<input
				type="tel"
				bind:value="{otp}"
				maxlength="4"
				pattern="[0-9]*"
				autocomplete="off"
				autofocus="{true}"
				on:input="{checkLength}"
				on:keypress="{onKeyPress}"
			/>

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
		</div>

		<p class="mb-2 text-sm">Didn't receive the OTP?</p>

		<div class="mb-5 text-sm">
			{#if (minutes || seconds) && (minutes >= 0 || seconds >= 0)}
				<div class="mx-auto flex max-w-max items-center gap-1">
					<span>Resend OTP in</span>

					<p class="flex items-center justify-center font-bold">
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
					on:click="{handleResendOtp}"
				>
					RESEND OTP
				</button>
			{/if}
		</div>

		<PrimaryButton loading="{loading}" class="w-full" type="submit">VERIFY</PrimaryButton>
	</form>
</div>
