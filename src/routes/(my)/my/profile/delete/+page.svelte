<script>
	import Button from '$lib/components/ui/button/button.svelte'
	import { MyProfileDeleteModule } from '$lib/core/composables/index.js'

	const deleteModule = new MyProfileDeleteModule()
</script>

<svelte:head>
	<title>Delete Account | Svelte Commerce</title>
</svelte:head>

<div class="mx-auto max-w-3xl py-8 md:py-12">
	<div class="mb-10">
		<h1 class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Delete Account</h1>
		<p class="mt-2 text-lg text-gray-500">We're sorry to see you go. Please review the following information carefully.</p>
	</div>

	<div class="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-xl shadow-red-500/5">
		<div class="bg-red-50/50 p-6 md:p-8">
			<h2 class="text-xl font-bold text-red-600">Is this goodbye?</h2>
			<p class="mt-2 text-sm font-medium text-red-600/70">Are you sure you want to delete your account? This action is permanent.</p>
		</div>

		<div class="p-6 md:p-8">
			<ul class="space-y-6">
				<li class="flex gap-4">
					<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">1</div>
					<div class="space-y-1">
						<p class="font-bold text-gray-900">Forfeit all benefits</p>
						<p class="text-sm leading-relaxed text-gray-500">
							You'll lose your order history, saved details, coupons, and benefits. These cannot be recovered. Please review our
							<a href="/privacy-policy" class="font-semibold text-primary hover:underline">Privacy Policy</a>.
						</p>
					</div>
				</li>
				<li class="flex gap-4">
					<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">2</div>
					<div class="space-y-1">
						<p class="font-bold text-gray-900">Pending Transactions</p>
						<p class="text-sm leading-relaxed text-gray-500">
							Any pending orders, exchanges, returns, or refunds will no longer be accessible via your account. We will attempt to complete open transactions within 30 days.
						</p>
					</div>
				</li>
				<li class="flex gap-4">
					<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">3</div>
					<div class="space-y-1">
						<p class="font-bold text-gray-900">Coupon Restrictions</p>
						<p class="text-sm leading-relaxed text-gray-500">
							We may not extend New User coupons if a new account is created with the same mobile number or email ID.
						</p>
					</div>
				</li>
				<li class="flex gap-4">
					<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">4</div>
					<div class="space-y-1">
						<p class="font-bold text-gray-900">Data Retention</p>
						<p class="text-sm leading-relaxed text-gray-500">
							Certain data may be retained for legitimate reasons such as security, fraud prevention, and regulatory compliance.
						</p>
					</div>
				</li>
			</ul>

			<div class="mt-12 flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
				<input
					type="checkbox"
					id="deleteAccount"
					class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
					bind:checked={deleteModule.iAgree}
				/>
				<label for="deleteAccount" class="text-sm font-semibold text-gray-700">
					I understand and agree to all the terms and conditions*
				</label>
			</div>

			<div class="mt-8 flex justify-end">
				<Button
					onclick={deleteModule.deleteUser}
					variant="destructive"
					class="h-12 px-10 font-bold shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
					disabled={!deleteModule.iAgree}
				>
					Permanently Delete My Account
				</Button>
			</div>
		</div>
	</div>
</div>

