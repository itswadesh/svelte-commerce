<script>
  export let product = {}
</script>

<style>
  i {
    margin: 2px;
  }
</style>

<div class="flex flex-wrap items-center p-3 text-xs text-gray-500">
  <a href="/" rel="prefetch">Home</a>
  <i class="fa fa-angle-right" aria-hidden="true" />
  <a href="/search" rel="prefetch">{product.categories}</a>
  <span class="hidden lg:block">
    <i class="fa fa-angle-right" aria-hidden="true" />
    {product.name}
  </span>
</div>
