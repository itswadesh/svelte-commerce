<script>
import Autocomplete from '$lib/components/Autocomplete/Autocomplete.svelte'
const search = ({ detail }) => {
	console.error('Autocomplete result', detail)
}
</script>

<Autocomplete placeholder="Search Products..." on:search="{search}" />
