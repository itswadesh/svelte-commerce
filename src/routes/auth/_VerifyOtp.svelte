<style>
.frosted {
	background-image: url('/auth/login/bg-lighter.svg');
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
#partitioned {
	padding-left: 18px;
	padding-bottom: 5px;
	letter-spacing: 42px;
	border: 0;
	font-weight: 600;
	font-size: larger;
	background-color: transparent;
	background-image: linear-gradient(to left, black 80%, rgba(255, 255, 255, 0) 0%);
	background-position: bottom;
	background-size: 53px 1px;
	background-repeat: repeat-x;
	background-position-x: 47px;
	width: 70%;
	outline: none;
}
</style>

<script>
import GradiantButton from '$lib/ui/GradiantButton.svelte'
import { createEventDispatcher, onMount } from 'svelte'
const dispatch = createEventDispatcher()

export let phone, resendAfter, loading

let otp

onMount(async () => {
	countDownTimerStart()
})

const countDownTimerStart = () => {
	if (resendAfter > 0) {
		setInterval(() => {
			resendAfter = resendAfter - 1
		}, 1000)
	}
}
function checkLength(e) {
	if (e.target.value?.length === 4) {
		dispatch('verifyOtp', e.target.value)
	} else {
		return
	}
}
</script>

<div>
	<div class="mb-5 flex flex-col items-center justify-center space-y-1 text-center">
		<div class="text-sm">Enter the OTP sent to</div>

		<div class="flex space-x-2 text-xs">
			<b>{phone} </b>
			<button
				type="button"
				class="font-bold text-primary-500 hover:text-primary-700 focus:outline-none"
				on:click="{() => dispatch('changeNumber')}">
				Change
			</button>
		</div>
	</div>

	<form
		class="mb-8 flex flex-col text-center"
		on:submit|preventDefault="{() => dispatch('verifyOtp', otp)}">
		<div class="mb-5 flex items-center justify-center space-x-5">
			<input
				id="partitioned"
				type="number"
				on:input="{checkLength}"
				maxlength="4"
				bind:value="{otp}" />
		</div>

		<span class="mb-2 text-sm">Didn't receive the OTP?</span>

		<div class="mb-5 text-sm">
			{#if resendAfter > 0}
				<span>You can resend OTP after <b>{resendAfter}</b> seconds</span>
			{:else}
				<button
					type="button"
					class="font-bold text-primary-500 hover:text-primary-700 focus:outline-none"
					on:click="{() => dispatch('resend', phone)}">
					RESEND OTP
				</button>
			{/if}
		</div>

		<GradiantButton class="mx-auto w-full max-w-sm" type="submit" loading="{loading}">
			VERIFY
		</GradiantButton>
	</form>
</div>
