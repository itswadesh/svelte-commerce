<script lang="ts">
import { currency } from '$lib/util'

export let order
</script>

<div
	class="
                mt-6 flex
                w-full
                flex-col
                text-sm text-gray-500
                lg:flex-row
              ">
	{#if order && order.address}
		<div class="mt-6 w-full p-6 shadow me-2 lg:mt-0 lg:w-1/2">
			<div class="border-b pb-2 text-lg font-medium">Shipping Information</div>
			<div class="my-4 text-base font-light">
				<div>
					<strong> Name:</strong>
					{order.address.firstName}
					{order.address.lastName}
				</div>
				<div class="my-2 w-2/3">
					<strong> Address:</strong>
					{order.address.address},
				</div>
				<div>
					{order.address.city},{order.address.country}
				</div>
				<div class="my-2">
					<strong> Pincode: </strong>
					{order.address.zip}
				</div>
				<div class="underline">
					<strong>Phone:</strong>
					{order.address.phone}
				</div>
				<div class="my-1 underline">
					<strong>Email:</strong>
					{order.address.email}
				</div>
			</div>
		</div>
	{/if}
	{#if order && order.amount}
		<div class="mt-6 w-full p-6 shadow lg:mt-0 lg:w-1/2">
			<div class="border-b pb-2 text-lg font-medium">Payment Information</div>
			<div class="my-4 text-base font-light">
				{#if order.amount.subtotal}
					<div>
						<strong> Subtotal:</strong>
						{currency(order.amount.subtotal)}
					</div>
				{/if}
				{#if order.amount.discount}
					<div class="my-2 w-2/3">
						<strong> Discount:</strong>
						{currency(order.amount.discount)},
					</div>
				{/if}
				{#if order.amount.shipping}
					<div class="my-2">
						<strong> Shipping: </strong>
						{currency(order.amount.shipping)}
					</div>
				{/if}
				{#if order.amount.total}
					<div class="underline">
						<strong>Total:</strong>
						{currency(order.amount.total)}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
