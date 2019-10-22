<script>
  import Textarea from "./../../components/ui/Textbox.svelte";
  import { fadeIn, fadeOut } from "./../../actions/pageFade";
  import Button from "./../../components/ui/Button.svelte";
  import { auth } from "./../../store/auth";
  import { get, put, post } from "./../../lib/api";
  let user = {},
    show = false,
    err = null;
  async function getMe() {
    user = await get("users/me");
  }
  getMe();
  async function submit() {
    try {
      user = await auth.updateProfile(user);
      show = true;
    } catch (e) {}
  }
</script>

<main in:fadeIn out:fadeOut class="m-auto w-full lg:w-1/2">
  <div class="flex justify-between items-center my-4">
    <a href="/my">
      <i class="fa fa-arrow-left" />
    </a>
    <div class="text-2xl font-bold px-6 text-center">Address</div>
  </div>
  {#if err}
    <p class="mb-2 p-2 text-xs primary rounded">{err}</p>
  {:else if show}
    <p class="mb-2 p-2 text-xs bg-yellow-400 rounded">Address Updated</p>
  {/if}
  <form on:submit|preventDefault={submit} class="text-center bg-white">
    <Textarea bind:value={user.address} label="Address" full={true} />
    <br />
    <Button type="submit" full={true} rounded={true} size="xl" color="primary">
      Save
    </Button>
  </form>
</main>
