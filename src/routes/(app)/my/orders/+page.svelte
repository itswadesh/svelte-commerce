<script>
import MyOrder from './_MyOrder.svelte'
import SEO from '$lib/components/SEO/index.svelte'

const seoProps = {
	title: 'Orders ',
	description: 'Orders '
}

export let data

console.log('zzzzzzzzzzzzzzzzzz', data)
</script>

<SEO {...seoProps} />

<section>
	<MyOrder orders="{data}" />
</section>
