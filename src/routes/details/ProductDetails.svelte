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
    <div class="flex flex-wrap">
      <div
        class="flex items-center px-3 text-gray-700 font-semibold py-3
        tracking-wider">
        <span class="text-lg mr-2">
          <img
            src="data:image/jpeg;base64,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"
            alt="flipkart"
            style="width: 30px; height: 30px;" />
        </span>
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
      <div
        class="flex items-center px-3 text-gray-700 font-semibold py-3
        tracking-wider">
        <span class="text-2xl mr-2">
          <img
            src="data:image/jpeg;base64,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"
            alt="amazon"
            style="width: 30px; height: 30px;" />
        </span>
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
      </div>
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
      {#if product.amazonUrl}
        <a
          target="blank"
          href={product.amazonUrl}
          class="w-1/2 lg:w-1/3 mr-2 bg-red-600 hover:bg-red-500 text-white py-2
          px-3 rounded font-bold text-xs lg:text-lg text-center">
          <i
            class="fa fa-shopping-bag mr-2 hidden lg:block"
            aria-hidden="true" />
          BUY FROM AMAZON
        </a>
      {/if}
      <a
        target="blank"
        href={product.productUrl}
        class="w-1/2 lg:w-1/3 bg-white border border-grey-300 text-black py-2
        px-3 rounded font-bold text-xs lg:text-lg text-center">
        <i class="fa fa-bookmark mr-2 hidden lg:block" aria-hidden="true" />
        BUY FROM FLIPKART
      </a>
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
