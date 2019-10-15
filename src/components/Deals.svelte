<script>
  import { onMount } from "svelte";
  import { truncate } from "./../lib";
  import { stores } from "@sapper/app";
  const { session } = stores();
  export let products = [],
    title = "";
  const uniqueId = `siema--${Math.random()
    .toString(36)
    .substring(2, 10)}`;
  let Siema,
    controller,
    currentSlide = 0;
  onMount(async () => {
    const module = await import("siema");
    Siema = module.default;
    controller = new Siema({
      selector: "." + uniqueId,
      loop: true,
      perPage: {
        300: 2,
        768: 3,
        1024: 6,
        1920: 8
      },
      onChange: onChangeCallback
    });
  });
  function onChangeCallback() {
    currentSlide = this.currentSlide;
  }
  function prev() {
    controller.prev();
  }
  function next() {
    controller.next();
  }
</script>

<style>
  .prev {
    position: absolute;
    outline: none;
    z-index: 100;
    top: 30%;
    left: -30px;
    width: 47px;
    height: 104px;
    background-color: hsla(0, 0%, 100%, 0.98) !important;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.11);
  }
  .next {
    position: absolute;
    outline: none;
    z-index: 100;
    top: 30%;
    right: -30px;
    width: 47px;
    height: 104px;
    background-color: hsla(0, 0%, 100%, 0.98) !important;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.11);
  }
</style>

<div
  class="relative my-5 pt-2 lg:pt-5 pb-5 mx-2 lg:mx-5 px-2 lg:px-5 shadow-lg
  border rounded">
  <h1 class="mb-5 text-gray-800 text-2xl">{title}</h1>
  <div class="">
    {#if currentSlide != 0}
      <button on:click={prev} class="hidden lg:block prev">
        <i class="fa fa-chevron-left" />
      </button>
    {/if}
    <button on:click={next} class="hidden lg:block next">
      <i class="fa fa-chevron-right" />
    </button>
    <div class={uniqueId}>
      {#each products as p (p._id)}
        <div class="mx-1 lg:mx-5">
          <a href={'/' + p.slug + '?id=' + p._id}>
            <img class="h-32" src={$session.settings.CDN_URL + p.img[0]} alt="" />
            <div class="mt-3 text-gray-800">{truncate(p.name, 45)}</div>
          </a>
        </div>
      {/each}
    </div>
  </div>
</div>
