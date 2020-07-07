<script>
  import { host } from './../config'
  import Nav from './../components/Nav.svelte'
</script>

<style>
  .banner-container {
    position: relative;
  }
  .content {
    line-height: 1.5;
  }
  h3 {
    letter-spacing: 10px;
  }
  ul > li a {
    margin: 20px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  ul > li img {
    max-width: 100%;
    height: 110px;
    margin-bottom: 1rem;
  }
</style>

<svelte:head>
  <title>List of India's best laptops - Curated manually</title>
  <meta
    data-hid="description"
    name="description"
    content="Collection of handpicked electronic items, worth buying. These are
    best in quality, performance, feels good to use, ergonomic, stylish" />
  <meta
    data-hid="og:title"
    name="og_title"
    content="List of India's best laptops - Curated manually" />
  <meta
    data-hid="og:title"
    name="og_title"
    property="og:title"
    content="Collection of handpicked electronic items, worth buying" />
  <meta name="og_url" property="og:url" content={`${host}/search`} />
  <!-- Twitter -->
  <meta name="twitter:title" content="Hand picked laptops for you" />
  <meta
    name="twitter:description"
    content="Collection of handpicked electronic items, worth buying. These are
    best in quality, performance, feels good to use, ergonomic, stylish" />
</svelte:head>
<Nav home={true} />
<div class="text-gray-700 ">
  <div class="flex flex-wrap items-center banner-container">
    <img src="banner.jpg" alt="Best Laptops" class="w-full mb-2" />
    <div class="mx-2 content md:mx-20 md:absolute">
      <h1 class="text-2xl font-bold md:text-3xl">
        Hand Picked Laptops for You
      </h1>
      <h2 class="text-sm md:text-md">
        SHOP FOR THE BEST LAPTOPS COLLECTION IN INDIA
      </h2>
      <div class="mt-5 ">
        <a
          href="search?brands=Asus&page=1"
          rel="prefetch"
          class="px-4 py-2 text-xs text-purple-700 bg-transparent border border-purple-500 rounded-full focus:outline-none hover:bg-purple-500 hover:text-white ">
          ASUS LAPTOPS
        </a>
      </div>
    </div>
  </div>
  <h3
    class="pt-5 pb-2 text-3xl text-center border-b-2 border-gray-400 border-dashed">
    Based on your requirements
  </h3>
  <ul class="flex flex-wrap">
    <li>
      <a href="/search?Processor%20Name=Core%20i7&page=1" rel="prefetch">
        <img src="/cpu.svg" alt="i7" />
        i7
      </a>
    </li>
    <li>
      <a href="/search?SSD=Yes&page=1" rel="prefetch">
        <img src="/ssd-drive.svg" alt="ssd" />
        SSD
      </a>
    </li>
    <li>
      <a href="/search?Backlit%20Keyboard=Yes&page=1" rel="prefetch">
        <img src="/keyboard.svg" alt="keyboard" />
        Backlit Keyboard
      </a>
    </li>
    <li>
      <a
        href="/search?Screen%20Size=39.62%20cm%20(15.6%20inch)&page=1"
        rel="prefetch">
        <img src="/analytics.svg" alt="screen" />
        15 inch
      </a>
    </li>
    <li>
      <a
        href="/search?Screen%20Type=Full%20HD%20LED%20Backlit%20Wideview%20Display&page=1"
        rel="prefetch">
        <img src="/1080p-full-hd.svg" alt="resolution" />
        FULL HD
      </a>
    </li>
    <li>
      <a href="/search?RAM=8%20GB&page=1" rel="prefetch">
        <img src="/ram.svg" alt="ram" />
        8GB RAM
      </a>
    </li>
    <li>
      <a href="/search?Finger%20Print%20Sensor=Yes&page=1" rel="prefetch">
        <img src="/finger-print.svg" alt="fingerprint" />
        FINGER PRINT
      </a>
    </li>
    <li>
      <a href="/search?Touchscreen=Yes&page=1" rel="prefetch">
        <img src="/laptop-touch.svg" alt="touch" />
        TOUCH SCREEN
      </a>
    </li>
  </ul>
</div>
