<script>
  import Header from "./../components/Header.svelte";
   import { fadeIn, fadeOut } from "./../actions/pageFade";
</script>
<main in:fadeIn out:fadeOut>
<Header />
<h1>Account</h1>
</main>