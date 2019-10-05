<script>
  import { currency } from "./../../lib";
  export let product = {};
</script>

<style>
  @keyframes fadeInOpacity {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>

<div class="flex p-2 w-1/2 lg:w-1/4 xl:w-1/5 justify-between">
  {#if product}
    <a href={'/' + product._source.slug + '?id=' + product._id} class="w-full">
      <div>
        {#if product._source.imgUrls}
          <img
            class="w-full h-64"
            style="object-fit: contain; max-height:316px;"
            src={product._source.imgUrls[0]['200x200']}
            alt />
        {/if}
        <div class="p-1 text-start">
          <div class="text-gray-900 lg:font-bold sm:font-normal text-sm">
            {product._source.name}
          </div>
          <div class="text-gray-700">
            {currency(product._source.specialPrice)}
            <del>{currency(product._source.price)}</del>
            <del>{currency(product._source.mrp)}</del>
          </div>
          <div class="text-black font-thin text-sm">
            {product._source.color.name}
          </div>
          {#if product._source.keyFeatures}
            <div class="text-black font-thin text-sm">
              <ul>
                {#each product._source.keyFeatures as f}
                  <li>{f}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      </div>
    </a>
  {/if}
</div>
