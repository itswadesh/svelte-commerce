<script>
  import { lazyload } from "../../actions/lazyload";
  import { stores } from "@sapper/app";
  const { preloading, page, session } = stores();
  export let product = {},
    currentImage = null;

  currentImage = product.img && product.img[0];
  function showAsCurrentImage(image) {
    currentImage = image;
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

<div class="w-full md:w-6/12 lg:w-5/12 flex justify-start flex-wrap px-2">
  <div class="flex-1 xs:order-1 md:order-2 overflow-hidden">
    <img
      use:lazyload
      src={$session.settings.CDN_URL + currentImage + '?tr=w-3,h-3'}
      data-src={$session.settings.CDN_URL + currentImage}
      alt={product.name}
      class="w-full zoom mb-3 object-contain" />
  </div>
</div>
