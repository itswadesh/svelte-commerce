<style>
.floating-label {
	position: relative;
}

.floating-input {
	font-size: 14px;
	color: #1f2937;
	display: block;
	width: 100%;
	padding: 20px 12px 0;
	border-bottom: 2px solid #e5e7eb;
}

label {
	color: #1f2937;
	font-size: 14px;
	font-weight: normal;
	position: absolute;
	pointer-events: none;
	left: 12px;
	top: 12px;
	transition: 0.2s ease all;
	-moz-transition: 0.2s ease all;
	-webkit-transition: 0.2s ease all;
}

.floating-input:focus ~ label,
.floating-input:not(:placeholder-shown) ~ label {
	top: 4px;
	font-size: 12px;
	color: #1f2937;
}

.floating-input:focus {
	border-bottom: 2px solid #112d4e;
}
</style>

<script lang="ts">
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

let clazz = ''
export { clazz as class }

export let label = '',
	type = 'text',
	value = '',
	name: string,
	placeholder = ' ',
	disabled = false,
	required = false
</script>

<div class="{clazz} floating-label">
	{#if type === 'text'}
		<input
			required="{required}"
			id="textbox"
			name="{name}"
			type="text"
			bind:value="{value}"
			class="floating-input w-full rounded border text-sm placeholder-zinc-400 transition duration-300 focus:outline-none{disabled
				? 'cursor-not-allowed bg-zinc-100'
				: ' bg-white hover:bg-zinc-50'}"
			placeholder="{placeholder}"
			aria-label="{label}"
			disabled="{disabled}"
			on:input="{() => dispatch('input')}"
			on:change="{() => dispatch('change')}" />
	{:else if type === 'email'}
		<input
			required="{required}"
			id="textbox"
			name="email"
			type="email"
			bind:value="{value}"
			class="floating-input w-full rounded border text-sm placeholder-zinc-400 transition duration-300 focus:outline-none{disabled
				? 'cursor-not-allowed bg-zinc-100'
				: ' bg-white hover:bg-zinc-50'}"
			placeholder="{placeholder}"
			aria-label="{label}"
			disabled="{disabled}"
			on:input="{() => dispatch('input')}"
			on:change="{() => dispatch('change')}" />
	{:else if type === 'password'}
		<input
			required="{required}"
			id="textbox"
			name="password"
			type="password"
			bind:value="{value}"
			class="floating-input w-full rounded border text-sm placeholder-zinc-400 transition duration-300 focus:outline-none{disabled
				? 'cursor-not-allowed bg-zinc-100'
				: ' bg-white hover:bg-zinc-50'}"
			placeholder="{placeholder}"
			aria-label="{label}"
			disabled="{disabled}"
			on:input="{() => dispatch('input')}"
			on:change="{() => dispatch('change')}" />
	{:else if type === 'date'}
		<input
			required="{required}"
			id="textbox"
			name="date"
			type="date"
			bind:value="{value}"
			class="floating-input w-full rounded border text-sm placeholder-zinc-400 transition duration-300 focus:outline-none{disabled
				? 'cursor-not-allowed bg-zinc-100'
				: ' bg-white hover:bg-zinc-50'}"
			placeholder="{placeholder}"
			aria-label="{label}"
			disabled="{disabled}"
			on:input="{() => dispatch('input')}"
			on:change="{() => dispatch('change')}" />
	{:else if type === 'time'}
		<input
			required="{required}"
			id="textbox"
			name="time"
			type="time"
			bind:value="{value}"
			class="floating-input w-full rounded border text-sm placeholder-zinc-400 transition duration-300 focus:outline-none{disabled
				? 'cursor-not-allowed bg-zinc-100'
				: ' bg-white hover:bg-zinc-50'}"
			placeholder="{placeholder}"
			aria-label="{label}"
			disabled="{disabled}"
			on:input="{() => dispatch('input')}"
			on:change="{() => dispatch('change')}" />
	{:else if type === 'number'}
		<input
			required="{required}"
			id="textbox"
			name="number"
			type="number"
			bind:value="{value}"
			class="floating-input w-full rounded border text-sm placeholder-zinc-400 transition duration-300 focus:outline-none{disabled
				? 'cursor-not-allowed bg-zinc-100'
				: ' bg-white hover:bg-zinc-50'}"
			placeholder="{placeholder}"
			aria-label="{label}"
			disabled="{disabled}"
			on:input="{() => dispatch('input')}"
			on:change="{() => dispatch('change')}" />
	{:else if type === 'tel'}
		<input
			required="{required}"
			id="textbox"
			name="tel"
			type="tel"
			bind:value="{value}"
			class="floating-input w-full rounded border text-sm placeholder-zinc-400 transition duration-300 focus:outline-none{disabled
				? 'cursor-not-allowed bg-zinc-100'
				: ' bg-white hover:bg-zinc-50'}"
			placeholder="{placeholder}"
			aria-label="{label}"
			disabled="{disabled}"
			on:input="{() => dispatch('input')}"
			on:change="{() => dispatch('change')}" />
	{:else if type === 'datetime-local'}
		<input
			required="{required}"
			id="textbox"
			name="datetime-local"
			type="datetime-local"
			bind:value="{value}"
			class="floating-input w-full rounded border text-sm placeholder-zinc-400 transition duration-300 focus:outline-none{disabled
				? 'cursor-not-allowed bg-zinc-100'
				: ' bg-white hover:bg-zinc-50'}"
			placeholder="{placeholder}"
			aria-label="{label}"
			disabled="{disabled}"
			on:input="{() => dispatch('input')}"
			on:change="{() => dispatch('change')}" />
	{/if}

	<label for="textbox">{label}</label>
</div>
