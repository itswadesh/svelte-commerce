<script>
  import { stores, goto } from "@sapper/app";
  const { session, page } = stores();
  import { get, put, post } from "./../lib/api";
  import Cookie from "cookie-universal";
  const cookies = Cookie();
  import Textbox from "./../components/ui/Textbox.svelte";
  import Passwordbox from "./../components/ui/Passwordbox.svelte";
  let loading = false,
    fadeIn = "",
    disable = "disable",
    p = {},
    msg = null,
    signup = false,
    uid = "1111111111",
    password = "",
    firstName = "",
    lastName = "",
    otp = "",
    showOTP = false,
    phoneno = /^[+()\d-]+$/,
    submitText = "Verify",
    err = null;
  $: isEmail = uid.includes("@");
  $: isPhone = uid.length >= 10 && uid.match(phoneno) ? true : false;
  $: if (uid) {
    showOTP = false;
    signup = false;
  }
  $: if (signup) {
    submitText = "Signup New Account";
  } else if (!isPhone && !isEmail && !showOTP) {
    submitText = "Verify";
  } else if (isPhone && !showOTP) {
    submitText = "Verify Phone";
  } else if (isEmail && !showOTP) {
    submitText = "Verify Email";
  } else if (isPhone && showOTP) {
    submitText = "Verify OTP";
  } else {
    submitText = "Login Now";
  }
  async function submit() {
    msg = err = null;
    if (!uid || uid == "") {
      err = "Please enter your email/phone no";
      return;
    }
    if (!isPhone && !isEmail) {
      err = "Entered email is not valid";
      return;
    }
    if (isPhone) {
      await phoneLogin();
    } else {
      await emailLogin();
    }
  }
  async function phoneLogin() {
    loading = true;
    if (!showOTP) {
      // When clicked 1st time
      try {
        const otp = await get("users/phone/" + uid);
        showOTP = true;
        msg = "Please enter OTP sent to your Mobile";
        // $refs.otp.focus();
        return;
      } catch (e) {
        err = e;
        console.log("err...", e);
      } finally {
        loading = false;
      }
    } else {
      // Final submission
      try {
        loading = true;
        const u = await post("auth/local", {
          uid,
          password: otp
        });
        $session.user = u.user;
        $session.token = u.token;
        cookies.set("token", u.token);
        goto("/");
      } catch (e) {
        err = e;
      } finally {
        loading = false;
      }
    }
  }
  async function emailLogin() {
    if (!showOTP) {
      // When clicked 1st time
      try {
        const otp = await get("users/email/" + uid);
        showOTP = true;
        msg = "Please enter your password";
        // $refs.otp.focus();
        return;
      } catch (e) {
        if (e.response && e.response.status == "400") {
          signup = true;
          showOTP = true;
          console.log("400 err...", e.response.status);
        } else {
          signup = true;
          showOTP = true;
          console.log("err...", e.toString());
        }
        err = "";
      } finally {
        showOTP = true;
        loading = false;
      }
    } else {
      // Final submission
      try {
        loading = true;
        if (signup) {
          // Signup
          const res = await post("auth/signup", {
            email: uid,
            firstName: firstName,
            lastName: lastName,
            password
          });
        } else {
          // Login
          const res = await post("auth/local", { uid, password });
        }
        // showOTP = true;
        goto("/");
        // $refs.password.focus();
      } catch (e) {
        showOTP = false;
        err = e;
        // $refs.uid.focus();
      } finally {
        showOTP = true;
        loading = false;
      }
    }
  }
  // function onPhoneChange() {}
  // function onKeyUpEvent(index, event) {
  //   const eventCode = event.which || event.keyCode;
  //   if (index == 4) {
  //     submit(); // Submit code
  //   }
  // }
  // onPhoneChange(e) {
  //   if (e.keyCode != 13) {
  //     showOTP = false;
  //     p = {};
  //     return;
  //   }
  // }
</script>

<style>
  .border-t {
    border-bottom: 1px solid lightgray;
  }
  .container {
    max-height: 80vh !important;
    min-height: 80vh !important;
  }
  .wraper-hide {
    visibility: hidden;
  }
  .border-t {
    border-bottom: 1px solid lightgray;
  }

  .otp-container .otp-seperator {
    background-color: #dfe1e6;
    border: 1px solid #dfe1e6;
  }
  .otp-container #wraper1 {
    top: 20px;
    left: 28px;
  }
  .otp-container #wraper2 {
    top: 20px;
    left: 51px;
  }
  .otp-container #wraper3 {
    top: 20px;
    left: 76px;
  }
  .otp-container #wraper4 {
    top: 20px;
    left: 100px;
  }
  .otp-container .otp-content {
    letter-spacing: 15px;
    border: 1px solid transparent;
  }
  input + label {
    position: relative;
    z-index: 999;
  }
</style>

<svelte:head>
  <title>Login to Hopyshopy</title>
  <meta
    data-hid="description"
    name="description"
    content="Login to Hopyshopy" />
  <meta data-hid="og:title" name="og_title" content="Login to Hopyshopy" />
</svelte:head>
<div>
  <div class="bg-gray-100 xs:mobile-login h-full px-4">
    <div class="container mx-auto h-full flex items-center">
      <div class="lg:w-1/3 w-full">
        <div class="border-teal border-t-12 bg-white mb-6 rounded shadow-2xl">
          <div class="p-0 secondary text-white rounded rounded-b-none">
            <h1 class="text-xl mb-6 text-left p-3">
              {#if !signup}
                <span class="font-extrabold">SIGN IN</span>
              {:else}
                <span class="font-extrabold">SIGN UP</span>
                TO YOUR ACCOUNT
              {/if}
            </h1>
          </div>
          <form on:submit|preventDefault={submit} class="center">
            <div class="p-6">
              {#if err}
                <div class="text-red-600 mb-5 text-center">{err}</div>
              {:else if msg}
                <div class="text-green-600 mb-5 text-center">{msg}</div>
              {/if}
              <Textbox bind:value={uid} label="Email/Phone" />
              <br />
              {#if signup}
                <Textbox value={firstName} label="Fisrt Name" class="w-full" />
                <br />
                <Textbox value={lastName} label="Last Name" class="w-full" />
                <br />
              {/if}
              <!-- <p class="text-red-500 mb-5 text-xs font-hairline">Please enter password</p> -->
              <!-- Show password box -->
              {#if !isPhone && showOTP}
                <Passwordbox
                  bind:value={password}
                  label="Password"
                  cls="w-full" />
              {:else if showOTP}
                <!-- Show OTP box -->
                <div class="otp-container">
                  <div
                    id="wraper1"
                    class="otp-seperator w-1 h-1 rounded absolute"
                    class:wraper-hide={otp.length > 0} />
                  <div
                    id="wraper2"
                    class="otp-seperator w-1 h-1 rounded absolute"
                    class:wraper-hide={otp.length > 1} />
                  <div
                    id="wraper3"
                    class="otp-seperator w-1 h-1 rounded absolute"
                    class:wraper-hide={otp.length > 2} />
                  <div
                    id="wraper4"
                    class="otp-seperator w-1 h-1 rounded absolute"
                    class:wraper-hide={otp.length > 3} />
                  <input
                    bind:value={otp}
                    name="otp"
                    class="otp-content outline-none pl-4 otp-content w-32
                    bg-transparent border border-gray-400"
                    maxlength="4"
                    autocomplete="off" />
                </div>
              {/if}
              <br />
              <br />
              <div class="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  class="flex items-center justify-center h-14 text-2xl
                  outline-none w-full font-bold py-2 rounded primary"
                  class:primary={!loading}
                  class:border={loading}>
                  {#if loading}
                    <img src="/loading.svg" alt class:loading />
                  {:else}{submitText}{/if}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
