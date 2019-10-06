<script>
  import Header from "./../components/Header.svelte";
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
  <title>India's best laptops guide - Curated manually</title>
</svelte:head>
<Header home={true} />
<div class=" text-gray-700">
  <div class="banner-container flex items-center flex-wrap">
    <img src="banner.jpg" alt="Best Laptops" class="w-full mb-2" />
    <div class="content mx-2 md:mx-20 md:absolute">
      <h1 class="text-2xl md:text-3xl font-bold">
        Hand Picked Laptops for You
      </h1>
      <h2 class="text-sm md:text-md">
        SHOP FOR THE BEST LAPTOPS COLLECTION IN INDIA
      </h2>
      <div class=" mt-5">
        <a
          href="search?q=asus"
          rel="prefetch"
          class="focus:outline-none bg-transparent hover:bg-purple-500
          hover:text-white text-purple-700 border border-purple-500 rounded-full
          px-4 py-2 text-xs ">
          ASUS LAPTOPS
        </a>
      </div>
    </div>
  </div>
  <h3
    class="border-b-2 border-dashed border-gray-400 text-center pt-5 pb-2
    text-3xl">
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
