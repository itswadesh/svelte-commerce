<script>
  import { lazyload } from '../../actions/lazyload'
  import { stores } from '@sapper/app'
  const { preloading, page, session } = stores()
  export let product = {},
    currentImage = null

  currentImage = product.img && product.img[0]
  function showAsCurrentImage(image) {
    currentImage = image
  }
</script>

<style>
  .zoom {
    transition: transform 0.7s;
  }
  .zoom:hover {
    transform: scale(1.035);
  }
</style>

<div class="flex flex-wrap justify-start w-full px-2 md:w-6/12 lg:w-5/12">
  <div class="flex-1 overflow-hidden xs:order-1 md:order-2">
    <img
      use:lazyload
      src={$session.settings.CDN_URL + currentImage + '?tr=w-3,h-2'}
      data-src={$session.settings.CDN_URL + currentImage}
      alt={product.name}
      class="object-contain w-full mb-3 zoom" />
  </div>
</div>
