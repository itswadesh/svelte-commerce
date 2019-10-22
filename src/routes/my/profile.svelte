<script>
  import Textbox from "./../../components/ui/Textbox.svelte";
  import Button from "./../../components/ui/Button.svelte";
  import { fadeIn, fadeOut } from "./../../actions/pageFade";
  import { auth } from "./../../store/auth";
  import { get, put, post } from "./../../lib/api";
  import { goto } from "@sapper/app";
  let user = {},
    show = false,
    err = null;
  async function getMe() {
    try {
      user = await get("users/me");
    } catch (e) {
      goto("/login");
    }
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
    <h1 class="text-2xl font-bold p-6 text-center">Profile</h1>
  </div>
  {#if err}
    <p class="mb-2 p-2 text-xs primary rounded">{err}</p>
  {:else if show}
    <p class="mb-2 p-2 text-xs bg-yellow-400 rounded">Profile Updated</p>
  {/if}
  <form on:submit|preventDefault={submit} class="center bg-white">
    <div class="">
      <Textbox bind:value={user.firstName} label="First Name" />
      <Textbox bind:value={user.lastName} label="Last Name" />
    </div>
    <br />
    <Button full={true} rounded={true} size="xl" color="primary">Save</Button>
  </form>
</main>
