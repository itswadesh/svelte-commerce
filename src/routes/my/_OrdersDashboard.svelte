<script>
let orders = [
	{
		id: '01010101',
		ordertime: '2 mins',
		item1: '1 Paneer butter masala',
		item2: '2 Chicken lemon pudina',
		item3: '1 Mushroom dopyaza',
		item4: '8 Garlic naan',
		paymentmethod: 'COD',
		amount: '$101.00',
	},

	{
		id: '01010101',
		ordertime: '3 mins',
		item1: '1 Paneer butter masala',
		item2: '2 Chicken lemon pudina',
		item3: '1 Mushroom dopyaza',
		item4: '8 Garlic naan',
		paymentmethod: 'COD',
		amount: '$101.00',
	},

	{
		id: '01010101',
		ordertime: '4 mins',
		item1: '1 Paneer butter masala',
		item2: '2 Chicken lemon pudina',
		item3: '1 Mushroom dopyaza',
		item4: '8 Garlic naan',
		paymentmethod: 'COD',
		amount: '$101.00',
	},
]
</script>

<section class="h-screen text-gray-800 bg-gray-200 overflow-hidden">
	<div class=" bg-primary-500 text-white">
		<h1 class="px-4 pt-4 uppercase font-medium  tracking-wide text-xl ">Orders</h1>

		<div class="mt-4 grid grid-cols-3 text-sm font-medium">
			<button
				class="col-span-1 text-center pb-1 border-b-4 border-transparent hover:border-white focus:outline-none">
				New
			</button>
			<button
				class="col-span-1 text-center pb-1 border-b-4 border-transparent hover:border-white focus:outline-none">
				Pending
			</button>
			<button
				class="col-span-1 text-center pb-1 border-b-4 border-transparent hover:border-white focus:outline-none">
				Delivered
			</button>
		</div>
	</div>

	<div class="overflow-y-auto h-full ">
		<div class="relative p-4 text-sm  ">
			<div
				class="absolute z-0 left-0 inset-y-0  h-full border-l-2 border-white"
				style="margin-left: 23px">
			</div>

			{#each orders as order, o}
				<div class="mb-8 relative z-10">
					<div class="flex items-center ">
						<div class="h-4 w-4 rounded-full border-2 border-primary-500 bg-white mr-2"></div>
						<div class="w-full flex items-center justify-between">
							<span>{order.id}</span> <span>{order.ordertime}</span>
						</div>
					</div>

					<div class="mt-3 bg-white rounded-md p-4 font-medium">
						<div class="flex flex-col  space-y-2">
							<span>{order.item1}</span>
							<span>{order.item2}</span>
							<span>{order.item3}</span>
							<span>{order.item4}</span>
						</div>

						<div class="mt-4 flex items-center ">
							<h6 class="text-gray-500">Payment :</h6>
							<span class="ml-2 font-bold ">{order.paymentmethod}</span>
						</div>

						<div class="mt-2 flex items-center ">
							<h6 class="text-gray-500">Amount :</h6>
							<span class="ml-2 font-bold ">{order.amount}</span>
						</div>

						<div class="mt-4 grid grid-cols-3 gap-2">
							<div class="col-span-1 ">
								<button
									class="bg-primary-500 py-1 w-full text-white rounded-md shadow-md border border-primary-500 focus:outline-none flex items-center justify-center hover:bg-primary-700 transition duration-300 transform active:scale-95">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"></path>
									</svg>
								</button>
							</div>

							<div class="col-span-1 ">
								<button
									class="bg-white py-1 w-full text-primary-500 hover:text-white rounded-md shadow-md border border-primary-500 focus:outline-none flex items-center justify-center hover:bg-primary-700 transition duration-300 transform active:scale-95">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clip-rule="evenodd"></path>
									</svg>
								</button>
							</div>

							<div class="col-span-1 ">
								<button
									class="bg-white py-1 w-full text-primary-500 hover:text-white rounded-md shadow-md border border-primary-500 focus:outline-none flex items-center justify-center hover:bg-primary-700 transition duration-300 transform active:scale-95">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
										></path>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
