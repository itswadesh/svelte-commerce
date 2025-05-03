<script lang="ts">
	import type { Snippet } from "svelte"

  interface Props {
    disableSubmitButton: boolean
    show?: boolean
    submit?: () => void
    close?: () => void
    content: Snippet<[SnippetParams]> 
  }

	let { content, show = $bindable(), disableSubmitButton, submit, close }: Props = $props()

	interface SnippetParams {
		handleSubmit: (e: Event) => void
    handleClose: () => void
	}

	let dontSubmit = false

	function handleSubmit(e: Event) {
		e.preventDefault()
		if (!disableSubmitButton) {
			submit?.()
		} else {
			dontSubmit = true

			setTimeout(() => {
				dontSubmit = false
			}, 820)
		}
	}

  function handleClose() {
    close?.()
    show = false
  }
</script>

{@render content({ handleSubmit, handleClose })}
