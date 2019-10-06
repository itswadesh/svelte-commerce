<script>
  export let product = {};
</script>

<style>

</style>

<div class="flex flex-wrap p-3">
  <div class="left-0 text-left text-xs text-gray-500">
    <a href="/" rel="prefetch">Home</a>
    <i class="fa fa-angle-right" aria-hidden="true" />
    {product.categories}
    <span class="hidden lg:block">
      <i class="fa fa-angle-right" aria-hidden="true" />
      {product.name}
    </span>
  </div>
  <!-- <div class="w-3/12 text-right right-0 pr-3">
      <i class="fa fa-share pr-2 text-gray-500" aria-hidden="true"></i>Share
    </div>-->
</div>
