<script>
	import Button from '$lib/components/ui/button/button.svelte'
	import { MyProfileDeleteModule } from '$lib/core/composables/use-my-profile-delete.svelte'

	const deleteModule = new MyProfileDeleteModule()
</script>

<svelte:head>
	<title>Delete My Account</title>
</svelte:head>
<h1 class="text-lg font-bold">Delete Account</h1>

<div class="my-5">
	<p class="font-bold">Is this goodbye? Are you sure you don't want to reconsider?</p>

	<ul class="ml-5 mt-3 list-disc space-y-3 text-sm">
		<li>
			<div class="font-bold">You'll lose your order history, saved details, coupons and benefits.</div>
			<div>
				Any account related benefits will be forfeited once the account is deleted and will no longer be available to you. You cannot recover the
				same. However, you can always create a new account. By deleting your account, you acknowledge you have read our <a
					style="color:#FF3F6C"
					href="/privacy-policy"><span>Privacy Policy</span></a
				>.
			</div>
		</li>
		<li>
			<div class="font-bold">Any pending orders, exchanges, returns or refunds will no longer be accessible via your account.</div>
			<div>
				Kitcommerce will try to complete the open transactions in the next 30 days on a best effort basis. However, we cannot ensure tracking &amp;
				traceability of transactions once the account is deleted.
			</div>
		</li>
		<li>
			<div class="font-bold">Kitcommerce may not extend New User coupon if an account is created with the same mobile number or email id.</div>
		</li>
		<li>
			<div class="font-bold">
				Kitcommerce may refuse or delay deletion in case there are any pending grievances related to orders, shipments, cancellations or any other
				services offered by Kitcommerce.
			</div>
		</li>
		<li>
			<div class="font-bold">
				Kitcommerce may retain certain data for legitimate reasons such as security, fraud prevention, future abuse, regulatory compliance including
				exercise of legal rights or comply with legal orders under applicable laws.
			</div>
		</li>
	</ul>

	<div class="mt-5 flex items-center gap-1 text-sm">
		<input type="checkbox" id="deleteAccount" bind:checked={deleteModule.iAgree} />
		<label for="deleteAccount">I agree to all the terms and conditions*</label>
	</div>

	<div class="mt-5">
		<Button onclick={deleteModule.deleteUser} variant="destructive" size="default" disabled={!deleteModule.iAgree}>Delete Account</Button>
	</div>
</div>

