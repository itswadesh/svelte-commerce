<script>
  import { lazyload } from './../actions/lazyload'
  import { stores } from '@sapper/app'
  const { session } = stores()
</script>

<!-- <div class="flex flex-wrap">
  <a
    class="w-full lg:w-1/3"
    href="https://www.hopyshopy.com/dell-xps-13-core-i7-8th-gen-16-gb512-gb-ssdwindows-10-home-9370-thin-and-light-laptop133-inch-gold-121-kg-with-ms-office?id=5da5f2ce3b9d4f6f4ba7921b">
    <img
      use:lazyload
      src={'/3px.png?tr=w-3,h-3'}
      data-src={'/dell-xps.svg'}
      alt="dell"
      class="object-cover w-full p-2 rounded shadow" />
  </a>
  <a
    class="w-full lg:w-1/3"
    href="https://www.hopyshopy.com/asus-zenbook-pro-duo-core-i7-9th-gen-32-gb1-tb-ssdwindows-10-home6-gb-graphics-ux581gv-h7201t-laptop156-inch-celestial-blue-25-kg?id=5db41645f046243a4672801c">
    <img
      use:lazyload
      src={'/3px.png?tr=w-3,h-3'}
      data-src={'/asus.svg'}
      alt="asus"
      class="object-cover w-full p-2 rounded shadow" />
  </a>
  <a
    class="w-full lg:w-1/3"
    href="https://www.hopyshopy.com/apple-macbook-pro-core-i9-8th-gen-16-gb512-gb-ssdmac-os-mojave4-gb-graphics-mv932hn154-inch-silver-183-kg?id=5da5f3353b9d4f6f4ba79a74">
    <img
      use:lazyload
      src={'/3px.png?tr=w-3,h-3'}
      data-src={'/mac.svg'}
      alt="apple"
      class="object-cover w-full p-2 rounded shadow" />
  </a>
</div> -->

<div class="flex flex-wrap space-between">
  <div class="w-full lg:w-1/3 lg:pr-4">
    <a
      href="/dell-xps-13-core-i7-8th-gen-16-gb512-gb-ssdwindows-10-home-9370-thin-and-light-laptop133-inch-gold-121-kg-with-ms-office?id=5da5f2ce3b9d4f6f4ba7921b">
      <img
        use:lazyload
        src={'/3px.png?tr=w-3,h-3'}
        data-src={'/mobile-developer.jpg'}
        alt="dell"
        class="object-cover w-full p-2 rounded shadow h-72" />
    </a>
  </div>
  <div class="w-full lg:w-1/3 lg:pr-4">
    <a
      href="/asus-zenbook-pro-duo-core-i7-9th-gen-32-gb1-tb-ssdwindows-10-home6-gb-graphics-ux581gv-h7201t-laptop156-inch-celestial-blue-25-kg?id=5db41645f046243a4672801c">
      <img
        use:lazyload
        src={'/3px.png?tr=w-3,h-3'}
        data-src={'/online-learning.jpg'}
        alt="apple"
        class="object-cover w-full p-2 rounded shadow h-72" />
    </a>
  </div>
  <div class="w-full h-72 lg:w-1/3">
    <a
      href="/apple-macbook-pro-core-i9-8th-gen-16-gb512-gb-ssdmac-os-mojave4-gb-graphics-mv932hn154-inch-silver-183-kg?id=5da5f3353b9d4f6f4ba79a74">
      <img
        use:lazyload
        src={'/3px.png?tr=w-3,h-3'}
        data-src={'/online-tutorials-concept.jpg'}
        alt="asus"
        class="object-cover w-full p-2 rounded shadow h-72" />
    </a>
  </div>
</div>
