<script>
  import { lazyload } from './../actions/lazyload'
  import { currency, truncate } from './../lib'
  import { stores } from '@sapper/app'
  const { session } = stores()
  export let product = {}
</script>

<div
  class="w-full max-w-sm p-4 overflow-hidden md:w-1/2 lg:w-1/3 xl:w-1/4 lg:mb-4">
  <a
    href={'/' + product._source.slug + '?id=' + product._id}
    class="block bg-white rounded-md shadow-md avatar zoom hover:shadow-lg">
    <img
      alt=""
      use:lazyload
      src={$session.settings.CDN_URL + product._source.img[0] + '?tr=w-3,h-2'}
      data-src={$session.settings.CDN_URL + product._source.img[0] + '?tr=w-300,h-200'}
      class="object-cover object-top w-full"
      style="" />
    <div class="px-8 py-4">
      <h2
        href={'/' + product._source.slug + '?id=' + product._source._id}
        class="text-xl truncate ">
        {product._source.name}
      </h2>
      <div class="flex flex-wrap items-center justify-between my-2 ">
        <div class="text-3xl font-bold ">
          {currency(product._source.flipkart.specialPrice)}
        </div>
        {#if product._source.stock < 1}
          <div class="text-xs text-red-500">Out of stock</div>
        {/if}
      </div>
    </div>
  </a>
</div>
<!-- <div class="flex justify-between w-1/2 p-2 lg:w-1/3 xl:w-1/4">
  {#if product}
    <a
      href={'/' + product.slug + '?id=' + product._id}
      rel="prefetch"
      class="overflow-hidden bg-white rounded-lg">
      <div class="relative pb-2/3">
        {#if product.img}
          <img
            use:lazyload
            src={$session.settings.CDN_URL + product.img[0] + '?tr=w-3,h-2'}
            data-src={$session.settings.CDN_URL + product.img[0] + '?tr=w-300,h-200'}
            class="absolute object-cover w-full h-full"
            alt="" />
        {/if}
      </div>
      <div class="p-6">
        <div class="flex items-baseline">
          <div class="text-lg font-semibold tracking-wide uppercase truncate">
            {currency(product.flipkart.specialPrice)}
          </div>
        </div>
        <h4 class="mt-1 text-xs text-gray-900">
          {truncate(product.name, 60)}
        </h4>
      </div>
    </a>
  {/if}
</div> -->
