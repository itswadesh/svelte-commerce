<script>
  import Footer from '../components/Footer.svelte'
  import { toast } from './../actions/toast.js'
  import { stores } from '@sapper/app'
  import Stylesheet from '../components/Stylesheet.svelte'
  import PreloadingIndicator from '../components/PreloadingIndicator.svelte'
  // import Nav from '../components/Nav.svelte'
  const { preloading } = stores()
</script>

{#if $preloading}
  <PreloadingIndicator />
{/if}
<Stylesheet />

<div class="flex flex-col min-h-screen font-sans antialiased text-gray-900">
  <!-- <Nav {segment} /> -->
  <div class="flex-1">
    <slot />
  </div>
  <Footer />
</div>
{#if $toast.show}
  <div class="flex justify-center">
    <div class="toast {$toast.color}">{$toast.msg}</div>
  </div>
{/if}
