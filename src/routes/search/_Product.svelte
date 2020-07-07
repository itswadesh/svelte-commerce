<script>
  import { lazyload } from '../../actions/lazyload'
  import { currency } from './../../lib'
  import { stores } from '@sapper/app'
  const { session } = stores()
  export let product = {}
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
  .zoom {
    transition: transform 0.7s;
  }
  .zoom:hover {
    transform: scale(1.035);
  }
</style>

<div class="flex justify-between w-1/2 p-2 lg:w-1/4 xl:w-1/5">
  {#if product}
    <a
      href={'/' + product._source.slug + '?id=' + product._id}
      rel="prefetch"
      class="w-full">
      <div>
        {#if product._source.img}
          <!-- for lazyloading to work src image needs to be low quality and should be about 3px by 3px 
          data-src holds the high quality image -->
          <img
            use:lazyload
            src={$session.settings.CDN_URL + product._source.img[0] + '?tr=w-3,h-2'}
            data-src={$session.settings.CDN_URL + product._source.img[0] + '?tr=w-300,h-200'}
            alt=""
            class="w-full mb-3 zoom"
            style="object-fit: contain; max-height:316px;" />
        {/if}
        <div class="p-1 text-start">
          <div class="text-sm text-gray-900 lg:font-bold sm:font-normal">
            {product._source.name}
          </div>
          <div class="text-gray-700">
            {currency(product._source.specialPrice || product._source.price)}
            <del>{currency(product._source.mrp)}</del>
          </div>
          <div class="text-sm font-thin text-black">
            {product._source.color.name}
          </div>
          {#if product._source.keyFeatures}
            <div class="text-sm font-thin text-black">
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
