<style>
.floating-label {
	position: relative;
}
.floating-input {
	font-size: 14px;
	color: black;
	display: block;
	width: 100%;
	padding: 12px 0 0 0;
	border-bottom: 2px solid #e5e7eb;
}
.floating-input:focus {
	outline: none;
	border-bottom: 2px solid #112d4e;
}
label {
	color: #1f2937;
	font-size: 14px;
	font-weight: normal;
	position: absolute;
	pointer-events: none;
	left: 0px;
	top: 18px;
	transition: 0.2s ease all;
	-moz-transition: 0.2s ease all;
	-webkit-transition: 0.2s ease all;
}

.floating-input:focus ~ label,
.floating-input:not(:placeholder-shown) ~ label {
	top: 0px;
	font-size: 12px;
	color: #999;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
	transition: background-color 5000s ease-in-out 0s;
}
</style>

<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let id = 'textarea'
export let maxlength
export let name = ''
export let placeholder = ' '
export let required = false
export let rows = 4
export let tabindex = 0
export let value = ''
export let label = ''

export let className = ''
export { className as class }
</script>

<div class="{className}">
	<div class="floating-label">
		<textarea
			bind:value="{value}"
			id="{id}"
			name="{name}"
			rows="{rows}"
			class="floating-input w-full bg-transparent focus:outline-none"
			placeholder="{placeholder}"
			aria-label="{label}"
			required="{required}"
			tabindex="{tabindex}"
			maxlength="{maxlength}"
			on:input="{() => dispatch('input')}"
			on:focus="{() => dispatch('focus')}"></textarea>

		<span class="highlight"></span>

		<label for="{id}">
			{label}

			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
		<slot />
	</div>
</div>
