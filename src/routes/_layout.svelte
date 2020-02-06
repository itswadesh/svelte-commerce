<script>
  import Footer from "../components/Footer.svelte";
  import { toast } from "./../actions/toast.js";
</script>

<main class="antialiased" style="min-height:92.5vh">
  <slot />
</main>

<Footer />

{#if $toast.show}
  <div class="flex justify-center">
    <div class="toast {$toast.color}">{$toast.msg}</div>
  </div>
{/if}
