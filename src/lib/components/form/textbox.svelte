<script lang="ts">
	import { Input } from '$lib/components/ui/input'
	import type { HTMLInputAttributes } from 'svelte/elements'
	import type { z } from 'zod'
	import { cn } from '$lib/core/utils'
	import Label from '../ui/label/label.svelte'
	import { FormTextboxRenderer } from '$lib/core/composables/index.js'
	import { AlertCircle, Eye, EyeOff } from '@lucide/svelte'

	interface $$Props extends HTMLInputAttributes {
		label?: string
		error?: string | string[]
		schema?: z.ZodType<any>
		validateOnChange?: boolean
		validityChange?: () => void
		optional?: boolean
		info?: string
		success?: boolean
		type?: string
		value?: string
		valid?: boolean
	}

	let {
		label,
		error,
		schema,
		validateOnChange = true,
		value = $bindable(),
		class: className = '',
		optional = false,
		info = '',
		success = false,
		type: initialType = 'text',
		validityChange = () => {},
		...props
	}: $$Props = $props()

	// One id shared by the <Label for> and the <Input id> so the field actually has an accessible
	// name. Prefer a caller-supplied id, then `name` (call sites that already hand-roll an outer
	// <label for="identifier"> pass name="identifier", so those associate for free), then an
	// SSR-stable generated one.
	const uid = $props.id()
	const inputId = $derived(props.id ?? props.name ?? uid)

	// Both derived from the field id, so they are stable across renders and unique per field.
	// The error used to be a sibling paragraph with nothing tying it to the input; these are what
	// aria-describedby points at.
	const messageId = $derived(`${inputId}-message`)
	const infoId = $derived(`${inputId}-info`)

	// Expose validation state
	//export { isValid as valid }
</script>

<FormTextboxRenderer {error} {schema} {validityChange} {initialType} {validateOnChange}>
	{#snippet content({ showPassword, type, touched, validationError, isValid, handleInput, togglePassword })}
		<!-- One decision for the whole field. `touched` gates the schema's own message, because a field
		     nobody has typed in yet should not shout; an `error` handed down from outside is a server or
		     submit-time rejection and renders immediately, which is what lets the checkout address form
		     mark the fields it rejected. -->
		{@const externalError = Array.isArray(error) ? error[0] : error}
		{@const message = validationError || externalError}
		{@const invalid = !!message && (touched || !!externalError)}
		{@const valid = !invalid && (success || (touched && isValid && !!schema))}
		{@const describedBy = [invalid ? messageId : null, info ? infoId : null].filter(Boolean).join(' ') || undefined}
		<div class="mb-3 space-y-2">
			{#if label}
				<Label for={inputId} class="block text-sm font-medium">
					{label}
					{#if optional}<span class="text-xs text-muted-foreground">(Optional)</span>{/if}
				</Label>
			{/if}
			<div class="relative">
				<!-- Both handlers must run. The markup used to end in a second `{...props}` spread, which
				     let a caller's `oninput` silently replace the schema validation; dropping that spread
				     reversed the bug and killed the caller's handler instead (login-modal's phone-number
				     sanitiser). Chaining keeps validation and the caller's handler alive together. -->
				<Input
					{...props}
					id={inputId}
					{type}
					bind:value
					oninput={(e) => {
						handleInput(e)
						props.oninput?.(e as Parameters<NonNullable<typeof props.oninput>>[0])
					}}
					aria-invalid={invalid ? 'true' : undefined}
					aria-describedby={describedBy}
					class={cn(className, 'w-full', invalid ? 'border-destructive' : valid ? 'border-success' : 'border-input')}
				/>

				{#if initialType === 'password'}
					<button
						type="button"
						class="absolute right-3 top-1/2 -translate-y-1/2 transform"
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						aria-controls={inputId}
						onclick={togglePassword}
					>
						{#if showPassword}
							<EyeOff class="size-4 text-muted-foreground hover:text-foreground" />
						{:else}
							<Eye class="size-4 text-muted-foreground hover:text-foreground" />
						{/if}
					</button>
				{/if}
			</div>
			{#if invalid}
				<div id={messageId} class="mt-1 flex items-start gap-1">
					<AlertCircle class="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
					<p class="text-sm font-medium text-destructive">{message}</p>
				</div>
			{/if}

			{#if info}
				<p id={infoId} class="text-xs text-muted-foreground">{info}</p>
			{/if}
		</div>
	{/snippet}
</FormTextboxRenderer>
