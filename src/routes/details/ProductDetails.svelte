<script>
  import Button from "./../../components/ui/Button.svelte";
  import { currency } from "./../../lib";
  export let product = {},
    selectedVariant = {},
    userSelectedVariant = null,
    shake = false,
    groupProducts = [],
    sizepopup = false,
    productDescription = false;
  function calculateOffPercent() {
    let percent =
      ((product.variants[0].mrp - product.variants[0].price) * 100) /
      product.variants[0].mrp;
    return Math.round(percent);
  }
  function calculatePrice() {
    let price = 0;
    if (product.variants[0].price < product.variants[0].mrp) {
      price = product.variants[0].price;
    } else {
      price = product.variants[0].mrp;
    }
    return price;
  }
  async function created() {
    if (product.group && product.group.trim()) {
      groupProducts = await get("products/groupItems/" + product.group);
    }
  }
  function showDescription() {
    productDescription = true;
    plusIcon = false;
    minusIcon = true;
  }
  function hideDescription() {
    productDescription = false;
    plusIcon = true;
    minusIcon = false;
  }
  function selectVariant(s) {
    selectedVariant = s;
    userSelectedVariant = s;
    selectedImgIndex = 0;
  }
</script>

<style>
  /** Hover Tooltip Css ***/
  .tooltip {
    position: relative;
    display: inline-block;
  }
  .tooltip .tooltiptext {
    visibility: hidden;
    width: 82px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 3px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 100%;
    left: 50%;
    margin-bottom: 7px;
    margin-left: -38px;
  }
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
  .tooltip .tooltiptext {
    opacity: 0;
    transition: opacity 0.5s;
  }
  .tooltip:hover .tooltiptext {
    opacity: 1;
  }
  .tooltip .tooltiptext::after {
    content: " ";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }
  /** End Hover Tooltip Css ***/

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
</style>

<div class="w-full md:w-6/12 lg:w-7/12 leading-relaxed">
  <div class="pb-4 border-b border-gray-200 px-3">
    <p class="text-2xl text-gray-700 font-semibold">{product.brandName}</p>
    <p>{product.name}</p>
  </div>
  {#if product}
    <div class="px-3 text-gray-700 font-semibold py-3 tracking-wider">
      <span class="text-2xl mr-2">
        {currency(product.specialPrice || product.price)}
      </span>
      {#if product.mrp > (product.specialPrice || product.price)}
        <span class="font-hairline line-through text-lg mr-2">
          {currency(product.mrp)}
        </span>
      {/if}
      {#if calculateOffPercent > 0}
        <span class="text-orange-500 text-xl">
          ({calculateOffPercent}% OFF)
        </span>
      {/if}
      <!-- <p class="text-sm font-hairline">
        Additional tax shall apply, charged at checkout
      </p> -->
    </div>
  {/if}
  <div>
    {#if groupProducts.data && groupProducts.data.length > 0}
      <div class="flex py-4 px-3">
        {#each groupProducts.data as p}
          <a
            href={'/' + p.slug + '?id=' + p._id}
            class="mr-3 rounded-full w-12 h-12 tooltip border border-gray-100
            hover:border-green-300 p-1"
            class.border-red-500={product.color.name === (p.color && p.color.name)}>
            <img
              src={p.imgUrls && p.imgUrls[0]}
              alt={p.color && p.color.name}
              class="rounded-full w-12 h-10" />
            {#if p.color}
              <span class="tooltiptext">{p.color.name}</span>
            {/if}
          </a>
        {/each}
      </div>
    {/if}
    <div
      class="flex mt-4 fixed bottom-0 lg:relative bg-white lg:px-3 p-2 w-full"
      style="z-index:9999;">
      <a
        href="https://www.amazon.in/gp/product/B07M7BZWV1/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=itswadesh-21&creative=24630&linkCode=as2&creativeASIN=B07M7BZWV1&linkId=eb27849b194e64127fdcc80e71f8eed0"
        class="w-7/12 lg:w-1/3 mr-2 bg-red-600 hover:bg-red-500 text-white py-2
        px-6 rounded font-bold text-sm lg:text-lg text-center">
        <i class="fa fa-shopping-bag mr-2 hidden lg:block" aria-hidden="true" />
        BUY FROM AMAZON
      </a>
      <!-- <button
        class="w-5/12 lg:w-1/3 bg-white border border-grey-300 text-black py-2
        px-6 rounded font-bold text-sm lg:text-lg">
        <i class="fa fa-bookmark mr-2 hidden lg:block" aria-hidden="true" />
        WISHLIST
      </button> -->
    </div>
    <div class="py-8 border-b border-gray-300 px-3">
      <p class="font-bold text-lg">
        TOP FEATURES
        <i class="fa fa-tag ml-2 text-gray-600" aria-hidden="true" />
      </p>
      <div>
        {#if product.keyFeatures}
          {#each product.keyFeatures as k}
            <div
              class="w-full my-2 lg:w-3/5 relative text-left px-3 py-2 rounded
              border hover:border-gray-500">
              <div class="font-bold">{k}</div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
    <div class="py-8 border-b border-gray-300 px-3">
      <p class="font-bold text-lg">
        PRODUCT DETAILS
        <i class="fa fa-list-alt ml-2 text-gray-600" aria-hidden="true" />
      </p>
      <span class="text-gray-500">{product.description}</span>
      {#if product.features}
        {#each product.features as f}
          <p class="font-bold text-lg">{f.key}</p>
          <div class="flex flex-wrap">
            <div class="border-b border-gray-400 mr-4 w-1/2">
              <span class="text-gray-700 text-sm">{f.val}</span>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
