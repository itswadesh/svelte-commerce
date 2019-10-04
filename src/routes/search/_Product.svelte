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
          <!-- <img
            class="w-full h-64"
            style="object-fit: cover; max-height:316px;"
            src={product._source.imgUrls[0]}
            alt /> -->
        {/if}
        <div class="p-1 text-center">
          <div class="text-gray-900 lg:font-bold sm:font-normal text-sm">
            {product._source.name}
          </div>
          <div
            class="text-black font-thin text-sm"
            v-if="product._source.categories && product._source.categories[0]">
            {product._source.categories[0].name}
          </div>
          <div class="text-gray-700">
            {currency(product._source.variants[0].price)}
          </div>
        </div>
      </div>
    </a>
  {/if}
</div>
