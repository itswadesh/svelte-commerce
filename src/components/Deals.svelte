<script>
  import { onMount } from 'svelte'
  import { truncate, currency } from './../lib'
  import { lazyload } from './../actions/lazyload'
  import { stores } from '@sapper/app'
  const { session } = stores()
  import Carousel from '@beyonk/svelte-carousel'
  import { ChevronLeftIcon, ChevronRightIcon } from 'svelte-feather-icons'
  import Product from './Product.svelte'
  export let products = [],
    title = ''
</script>

<style>
  .prev {
    position: absolute;
    outline: none;
    z-index: 100;
    top: 30%;
    left: -35px;
    width: 47px;
    height: 104px;
    background-color: hsla(0, 0%, 100%, 0.98) !important;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.11);
  }
  .next {
    position: absolute;
    outline: none;
    z-index: 100;
    top: 30%;
    right: -35px;
    width: 47px;
    height: 104px;
    background-color: hsla(0, 0%, 100%, 0.98) !important;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.11);
  }
</style>

<!-- w-1/2 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/5  -->
<div class="relative px-2 pt-2 mx-0 rounded lg:pt-5 lg:mx-5 lg:px-5">
  <h1 class="mb-5 text-2xl font-bold text-gray-800 underline">{title}</h1>
  {#if products && products.length}
    <Carousel perPage={{ 320: 1, 786: 2, 1199: 4, 1919: 5 }}>
      <span class="prev control" slot="left-control">
        <ChevronLeftIcon />
      </span>
      {#each products as product (product._id)}
        <div class="mr-4 slide-content">
          <a
            href={'/' + product.slug + '?id=' + product._id}
            class="block bg-white rounded-md shadow-md avatar zoom hover:shadow-lg">
            <img
              alt=""
              use:lazyload
              src={$session.settings.CDN_URL + product.img[0] + '?tr=w-3,h-2'}
              data-src={$session.settings.CDN_URL + product.img[0] + '?tr=w-300,h-200'}
              class="object-cover object-top w-full"
              style="" />
            <div class="px-8 py-4">
              <h2
                href={'/' + product.slug + '?id=' + product._id}
                class="text-xl truncate ">
                {product.name}
              </h2>
              <div class="flex flex-wrap items-center justify-between my-2 ">
                <div class="text-3xl font-bold ">
                  {currency(product.flipkart.specialPrice)}
                </div>
                {#if product.stock < 1}
                  <div class="text-xs text-red-500">Out of stock</div>
                {/if}
              </div>
            </div>
          </a>
        </div>
      {/each}
      <span class="next control" slot="right-control">
        <ChevronRightIcon />
      </span>
    </Carousel>
  {/if}
</div>
