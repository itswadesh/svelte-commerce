<script>
  let categories = [];
</script>

<style>
  .mega-menu {
    display: none;
    left: 0;
    position: absolute;
    text-align: left;
    width: 100%;
    z-index: 9999;
  }

  /* #hoverable Class Styles
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  .hoverable {
    position: static;
  }

  .hoverable > a:after {
    font-size: 10px;
    padding-left: 6px;
    position: relative;
    top: -1px;
  }

  .hoverable:hover .mega-menu {
    display: block;
  }
</style>

<ul class="flex">
  {#each categories as category}
    <li class="hoverable hover:bg-gray-300" :key="category._id">
      <a
        href={`/search?q=${category.slug}`}
        class="relative block py-6 px-4 lg:p-6 text-sm lg:text-base font-bold
        items-center">
        {category.name && category.name.toUpperCase()}
        <i class="fa fa-angle-down" aria-hidden="true" />
      </a>
      <div class="mega-menu mb-16 sm:mb-0 shadow-xl bg-gray-100">
        <div class="mx-auto w-full flex flex-wrap justify-start mx-2">
          {#each category.children as c, ix}
            <ul
              :key="c._id"
              class="bg-gray-100 px-4 w-full sm:w-1/2 lg:w-1/6 border-gray-600
              border-b lg:border-b-0 pb-6 pt-6 lg:pt-3">
              <div class="flex">
                <div
                  class="flex font-bold text-sm text-black text-bold mb-1
                  items-center">
                  {c.name}
                  <div class="pl-1" style="padding-top:2px;">
                    <i class="fa fa-caret-right" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div class="flex items-center py-3">
                <ul>
                  {#each c.children as c, index}
                    <li class="py-1 text-gray-600" :key="index">
                      <nuxt-link :to="`/search?q=${c.slug}`">
                        {c.name}
                      </nuxt-link>
                    </li>
                  {/each}
                </ul>
              </div>
            </ul>
          {/each}
        </div>
      </div>
    </li>
  {/each}
</ul>
