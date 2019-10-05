<script>
  export let product = {},
    currentImage = null,
    carouselShow = false;

  currentImage =
    product.imgUrls && product.imgUrls[0] && product.imgUrls[0]["800x800"];
  function showAsCurrentImage(image) {
    currentImage = image["800x800"];
  }
</script>

<style scoped>
  .zoom {
    transition: transform 0.7s;
  }
  .zoom:hover {
    transform: scale(1.035);
  }
</style>

<div class="w-full md:w-6/12 lg:w-5/12 flex justify-start flex-wrap px-2">
  <!-- <div class="flex md:flex-col hidden md:block md:order-1">
    {#each product.imgUrls as i, ix}
      <img
        class="w-24 cursor-pointer"
        src={i['200x200']}
        alt
        on:click={()=>showAsCurrentImage(i)} />
    {/each}
  </div> -->
  <div class="flex-1 xs:order-1 md:order-2 overflow-hidden">
    <img class="w-full zoom" src={currentImage} alt="" />
  </div>
</div>
