<style>
.floating-label {
	position: relative;
}
.floating-input {
	font-size: 14px;
	padding: 4px 4px;
	display: block;
	width: 100%;
	padding: 20px 12px 0;
	border: 1px solid #e5e7eb;
	border-bottom: 2px solid #e5e7eb;
}

.floating-input:focus {
	outline: none;
	border-bottom: 2px solid #6366f1;
}

label {
	color: #1f2937;
	font-size: 14px;
	font-weight: normal;
	position: absolute;
	pointer-events: none;
	left: 12px;
	top: 13px;
	transition: 0.2s ease all;
	-moz-transition: 0.2s ease all;
	-webkit-transition: 0.2s ease all;
}

.floating-input:focus ~ label,
.floating-input:not(:placeholder-shown) ~ label {
	top: 4px;
	font-size: 12px;
	color: #6366f1;
}

.floating-select:focus ~ label,
.floating-select:not([value='']):valid ~ label {
	top: -18px;
	font-size: 14px;
	color: #555;
}
</style>

<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let label = '',
	value = '',
	className = '',
	placeholder = ' ',
	rows = 4,
	required = false

export { className as class }
</script>

<div class="{className}">
	<div class="floating-label">
		<textarea
			name="textarea"
			rows="{rows}"
			required="{required}"
			bind:value
			class="floating-input w-full rounded border-b border-gray-300 bg-gray-50 text-sm hover:bg-white focus:outline-none "
			placeholder="{placeholder}"
			aria-label="{label}"
			on:change="{() => dispatch('change')}"></textarea>
		<span class="highlight"></span>
		<label for="textarea">{label}</label>
	</div>
</div>
