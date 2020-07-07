<script>
  import { fadeIn, fadeOut } from './../actions/pageFade'
  import Textbox from './../components/ui/Textbox.svelte'
  import Textarea from './../components/ui/Textarea.svelte'
  import { get, put, post } from './../lib/api'
  import { onMount } from 'svelte'
  import Product from './../components/ProductNew.svelte'

  let amazonUrl = '',
    products = []
  async function getData() {
    try {
      let res = await get('electronics/no/amazon')
      products = res.data
    } catch (e) {
      console.log('err...', e.toString())
    }
  }
  onMount(async () => {
    await getData()
  })
</script>

<main in:fadeIn out:fadeOut style="min-height:94vh">
  <div class="mx-2 mb-8">
    <div class="flex flex-wrap">
      {#each products as p}
        <Product product={p} on:update={getData} />
      {/each}
    </div>
  </div>
</main>
