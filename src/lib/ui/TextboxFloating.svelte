<style>
.floating-label {
	position: relative;
}
.floating-input {
	font-size: 14px;
	display: block;
	width: 100%;
	height: 46px;
	padding: 12px 0 0 0;
	border-bottom: 2px solid #0a6ce8;
}

label {
	color: #1f2937;
	font-size: 14px;
	font-weight: normal;
	position: absolute;
	pointer-events: none;
	left: 0px;
	top: 16px;
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

.input-class {
	@apply w-full bg-transparent focus:outline-none;
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

export let label = '',
	type = 'text',
	value = '',
	id = '',
	name = '',
	className = '',
	placeholder = ' ',
	required = false

export { className as class }
</script>

<div class="{className}">
	<div class="floating-label">
		{#if type === 'text'}
			<input
				type="text"
				bind:value
				id="{id}"
				name="{name}"
				class="input-class floating-input"
				placeholder="{placeholder}"
				aria-label="{label}"
				required="{required}"
				on:input="{() => dispatch('input')}" />
		{:else if type === 'email'}
			<input
				type="email"
				bind:value
				id="{id}"
				name="{name}"
				class="input-class floating-input"
				placeholder="{placeholder}"
				aria-label="{label}"
				required="{required}"
				on:input="{() => dispatch('input')}" />
		{:else if type === 'password'}
			<input
				type="password"
				bind:value
				id="password"
				name="password"
				class="input-class floating-input"
				placeholder="{placeholder}"
				aria-label="{label}"
				required="{required}"
				on:input="{() => dispatch('input')}" />
		{:else if type === 'date'}
			<input
				type="date"
				bind:value
				id="{id}"
				name="{name}"
				class="input-class floating-input"
				placeholder="{placeholder}"
				aria-label="{label}"
				required="{required}"
				on:input="{() => dispatch('input')}" />
		{:else if type === 'time'}
			<input
				type="time"
				bind:value
				name="time"
				id="time"
				class="input-class floating-input"
				placeholder="{placeholder}"
				aria-label="{label}"
				required="{required}"
				on:input="{() => dispatch('input')}" />
		{:else if type === 'number'}
			<input
				type="number"
				bind:value
				id="{id}"
				name="{name}"
				class="input-class floating-input"
				placeholder="{placeholder}"
				aria-label="{label}"
				required="{required}"
				on:input="{() => dispatch('input')}" />
		{:else if type === 'tel'}
			<input
				type="tel"
				bind:value
				id="{id}"
				name="{name}"
				class="input-class floating-input"
				placeholder="{placeholder}"
				aria-label="{label}"
				required="{required}"
				on:input="{() => dispatch('input')}" />
		{/if}
		<span class="highlight"></span>

		<label for="textbox">{label}</label>
		<slot />
	</div>
</div>
