<script>
  import Passwordbox from './../../components/ui/Passwordbox.svelte'
  import { fadeIn, fadeOut } from './../../actions/pageFade'
  import Button from './../../components/ui/Button.svelte'
  import { auth } from './../../store/auth'
  import { goto } from '@sapper/app'
  let password = {},
    show = false,
    err = null
  // async function getMe() {
  //   try {
  //     user = await get("users/me");
  //   } catch (e) {
  //     goto("/login");
  //   }
  // }
  // getMe();
  async function submit() {
    try {
      password = await auth.changePassword(password)
      show = true
    } catch (e) {
      err = e
    }
  }
</script>

<main in:fadeIn out:fadeOut class="w-full m-auto lg:w-1/2">
  <div class="flex items-center justify-between my-4">
    <a href="/my">
      <i class="fa fa-arrow-left" />
    </a>
    <h1 class="p-6 text-2xl font-bold text-center">Change Password</h1>
  </div>
  {#if err}
    <p class="p-2 mb-2 text-xs rounded primary">{err}</p>
  {:else if show}
    <p class="p-2 mb-2 text-xs bg-yellow-400 rounded">Password Changed</p>
  {/if}
  <form on:submit|preventDefault={submit} class="text-center bg-white">
    <Passwordbox bind:value={password.oldPassword} label="Current Password" />
    <Passwordbox bind:value={password.newPassword} label="New Password" />
    <br />
    <Button type="submit" full={true} rounded={true} size="xl" color="primary">
      Save
    </Button>
  </form>
</main>
