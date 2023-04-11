<script>
import Fuse from 'fuse.js'
let results = []
let data = [{ name: 'Apple' }, { name: 'Bananna' }]
const options = {
	keys: ['name', 'description']
}

export function search(query, data) {
	const fuse = new Fuse(data, options)
	results = fuse.search(query)
}
</script>

<input type="text" on:input="{(event) => search(event.target.value, data)}" />
<ul>
	{#each results as result}
		<li>{result.item?.name}</li>
	{/each}
</ul>
