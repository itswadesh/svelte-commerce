<script>
  import { goto } from '@sapper/app'
  import { stores } from '@sapper/app'
  const { session } = stores()
  import { lazyload } from './../actions/lazyload'
</script>

<style>
  .presentation {
    display: flex;
    width: 90%;
    margin: auto;
    min-height: 80vh;
    align-items: center;
  }
  .introduction {
    flex: 1;
  }
  .intro-text h1 {
    font-size: 44px;
    font-weight: 500;
    background: linear-gradient(to right, #494964, #6f6f89);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .intro-text p {
    margin-top: 5px;
    font-size: 22px;
    color: #585772;
  }
  .cta {
    padding: 50px 0px 0px 0px;
  }
  .cta-select {
    border: 2px solid #38eaff;
    background: transparent;
    color: #38eaff;
    width: 150px;
    height: 50px;
    cursor: pointer;
    font-size: 16px;
  }
  .cta-add {
    background: #38eaff;
    width: 150px;
    height: 50px;
    cursor: pointer;
    font-size: 16px;
    border: none;
    color: white;
  }
  .cover {
    flex: 1;
    display: flex;
    justify-content: center;
    height: 60vh;
  }
  .cover img {
    height: 100%;
    filter: drop-shadow(0px 5px 3px black);
    animation: drop 1.5s ease;
  }
  @keyframes drop {
    0% {
      opacity: 0;
      transform: translateY(-80px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @media screen and (max-width: 1024px) {
    .presentation {
      flex-direction: column;
    }
    .introduction {
      margin-top: 5vh;
      text-align: center;
    }
    .intro-text h1 {
      font-size: 30px;
    }
    .intro-text p {
      font-size: 18px;
    }
    .cta {
      padding: 10px 0px 0px 0px;
    }
    .cover img {
      height: 80%;
    }
  }
</style>

<section class="presentation">
  <div class="introduction">
    <div class="intro-text">
      <h1>Laptop for the future</h1>
      <p>
        The new 14 inch bezeless display oferring a 4k display with touch
        screen.
      </p>
    </div>
    <div class="cta">
      <button class="cta-select" on:click={() => goto('/search')}>
        All laptops
      </button>
      <button class="ml-5 cta-add" on:click={() => goto('/search')}>
        Buy Now
      </button>
    </div>
  </div>
  <div class="cover">
    <img
      use:lazyload
      src="/3px.png"
      alt="matebook"
      data-src={$session.settings.CDN_URL + ($session.settings.banners && $session.settings.banners.hero && $session.settings.banners.hero.img)} />
  </div>
</section>
