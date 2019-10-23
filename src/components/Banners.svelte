<script>
  import { lazyload } from "./../actions/lazyload";
</script>

<div class="flex flex-wrap">
  <img
    use:lazyload
    src="/3px.png"
    data-src="/dell-xps.svg"
    alt="dell"
    class="h-64 p-2 shadow lg:w-1/3 object-cover rounded" />
  <img
    use:lazyload
    src="/3px.png"
    data-src="/asus.svg"
    alt="asus"
    class="h-64 p-2 shadow lg:w-1/3 object-cover rounded" />
  <img
    use:lazyload
    src="/3px.png"
    data-src="/mac.svg"
    alt="apple"
    class="h-64 p-2 shadow lg:w-1/3 object-cover rounded" />
</div>
