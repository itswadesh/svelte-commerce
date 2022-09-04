<script>
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import { fly } from 'svelte/transition'

  const dispatch = createEventDispatcher()

  export let loading = false,
    formChanged = false,
    loadingMessage = null,
    successMessage = null,
    errors = null

  function emitSave() {
    dispatch('save')
  }
  // function mounted() {
  // 	document.addEventListener('keydown', this.ctrlSPressed)
  // }

  // function beforeDestroy() {
  // 	document.removeEventListener('keydown', this.ctrlSPressed)
  // }
  // onDestroy(() => {
  // 	document.removeEventListener('keydown', this.ctrlSPressed)
  // })

  function ctrlSPressed(e) {
    if (!(e.keyCode === 83 && (e.ctrlKey || e.metaKey))) {
      return
    }
    e.preventDefault()
    dispatch('save')
  }
</script>

<svelte:window on:keydown={ctrlSPressed} />
{#if formChanged}
  <div
    class="bg-primary-100 fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between p-2 text-center text-sm shadow-lg md:p-3 md:px-5"
    transition:fly={{ y: -20, duration: 300 }}
  >
    <h6
      class="flex max-w-max flex-row items-center gap-2 text-gray-600 md:mx-auto"
    >
      {#if loading}
        <span class=" sm:block "> {@html loadingMessage || 'Saving...'} </span>
      {:else if successMessage}
        <span class=" sm:block "> {@html successMessage || 'Success.'} </span>
      {:else if errors && errors.length}
        {#each errors as e}
          <span class=" sm:block "> {@html e.message} </span>
        {/each}
      {:else}
        <span class=" sm:block">
          There are unsaved changes on this page. Press
        </span>
        <span><b>Ctrl + S</b> to save.</span>
      {/if}
    </h6>

    <form class="max-w-max" on:submit|preventDefault={emitSave}>
      <button
        class="btn px-10 sm:px-16 {loading ? 'loading' : ''}"
        type="submit">SAVE</button
      >
    </form>
  </div>
{/if}
