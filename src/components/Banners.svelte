<script>
  import { lazyload } from "./../actions/lazyload";
  import { stores } from "@sapper/app";
  const { session } = stores();
</script>

<div class="flex flex-wrap">
  <img
    use:lazyload
    src={$session.settings.CDN_URL + '/3px.png?tr=w-3,h-3'}
    data-src={$session.settings.CDN_URL + '/dell-xps.svg'}
    alt="dell"
    class="h-64 p-2 shadow lg:w-1/3 object-cover rounded" />
  <img
    use:lazyload
    src={$session.settings.CDN_URL + '/3px.png?tr=w-3,h-3'}
    data-src={$session.settings.CDN_URL + '/asus.svg'}
    alt="asus"
    class="h-64 p-2 shadow lg:w-1/3 object-cover rounded" />
  <img
    use:lazyload
    src={$session.settings.CDN_URL + '/3px.png?tr=w-3,h-3'}
    data-src={$session.settings.CDN_URL + '/mac.svg'}
    alt="apple"
    class="h-64 p-2 shadow lg:w-1/3 object-cover rounded" />
</div>
