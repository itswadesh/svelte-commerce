<script>
  import { lazyload } from "./../actions/lazyload";
  import { currency } from "./../lib";
  import { stores } from "@sapper/app";
  const { session } = stores();
  export let product = {};
</script>

<div class="flex p-2 w-1/2 lg:w-1/3 xl:w-1/4 justify-between">
  {#if product}
    <a
      href={'/' + product._source.slug + '?id=' + product._id}
      rel="prefetch"
      class="bg-white border rounded-lg overflow-hidden">
      <div class="relative pb-2/3">
        {#if product._source.img}
          <img
            use:lazyload
            src={$session.settings.CDN_URL + product._source.img[0] + '?tr=w-3,h-2'}
            data-src={$session.settings.CDN_URL + product._source.img[0] + '?tr=w-300,h-200'}
            class="absolute h-full w-full object-cover"
            alt="" />
        {/if}
      </div>
      <div class="p-6">
        <div class="flex items-baseline">
          <span
            class="inline-block bg-teal-200 text-teal-800 text-xs px-2
            rounded-full uppercase font-semibold tracking-wide">
            New
          </span>
          <div
            class="ml-2 text-gray-600 text-xs uppercase font-semibold
            tracking-wide">
            {product._source.color.name} &bull; {product._source.size}
          </div>
        </div>
        <h4 class="mt-1 font-semibold text-lg leading-tight truncate">
          {product._source.name}
        </h4>
        <div class="mt-1">
          {currency(product._source.specialPrice || product._source.price)}
          <del class="text-gray-600 text-sm">
            {currency(product._source.mrp)}
          </del>
        </div>
        <div class="mt-2 flex items-center">
          <svg
            v-for="i in 5"
            :key="i"
            viewBox="0 0 24 24"
            :class="i <= product.rating ? 'text-teal-500' : 'text-gray-400'"
            class="h-4 w-4 fill-current">
            <path
              d="M8.128 19.825a1.586 1.586 0 0 1-1.643-.117 1.543 1.543 0 0
              1-.53-.662 1.515 1.515 0 0 1-.096-.837l.736-4.247-3.13-3a1.514
              1.514 0 0
              1-.39-1.569c.09-.271.254-.513.475-.698.22-.185.49-.306.776-.35L8.66
              7.73l1.925-3.862c.128-.26.328-.48.577-.633a1.584 1.584 0 0 1 1.662
              0c.25.153.45.373.577.633l1.925 3.847
              4.334.615c.29.042.562.162.785.348.224.186.39.43.48.704a1.514 1.514
              0 0 1-.404 1.58l-3.13 3 .736
              4.247c.047.282.014.572-.096.837-.111.265-.294.494-.53.662a1.582
              1.582 0 0 1-1.643.117l-3.865-2-3.865 2z" />
          </svg>
          <span class="ml-2 text-gray-600 text-sm">{5} reviews</span>
        </div>
      </div>
    </a>
  {/if}
</div>
