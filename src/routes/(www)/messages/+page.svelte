<script lang="ts">
	import { date } from '$lib/core/utils'
	import Textarea from '$lib/components/ui/textarea/textarea.svelte'
	import { MessagesModule } from '$lib/core/composables/use-messages.svelte'
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte'
	const messagesModule = new MessagesModule()
</script>

<svelte:head>
	<title>Messages</title>
</svelte:head>

<!-- Mobile chat ui -->

<div class="block h-[650px] overflow-hidden rounded-lg border text-sm shadow xl:hidden">
	{#if messagesModule.loading}
		<div class="flex flex-col gap-5 p-5">
			<div class="bg-primary-50 h-16 w-full animate-pulse"></div>

			<ul class="m-0 flex list-none flex-col gap-5 p-0">
				{#each { length: 5 } as _}
					<li>
						<Skeleton />
					</li>
				{/each}
			</ul>
		</div>
	{:else if messagesModule.selectedChat}
		<!-- The chat inbox (depth: 3) -->

		<!-- Chat headings -->

		<div class="flex h-16 items-center justify-between gap-5 border-b px-5">
			<div class="flex flex-1 items-center gap-5">
				<!-- Back to depth 2 -->

				<button
					type="button"
					class="text-primary-500 hover:text-primary-700 transition duration-300 focus:outline-none"
					onclick={() => {
						messagesModule.selectedChat = null
						messagesModule.getAllChats()
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="h-6 w-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
					</svg>
					<span class="sr-only">Back to chat list</span>
				</button>

				<!-- User info -->

				<div class="flex flex-1 items-center gap-2">
					{#if messagesModule.selectedChat?.user?.avatar}
						<img
							src={messagesModule.selectedChat?.user?.avatar}
							height="48"
							width="48"
							alt="avatar"
							class="h-12 w-12 rounded-full object-cover object-center"
						/>
					{:else}
						<div class="bg-primary-50 h-12 w-12 rounded-full"></div>
					{/if}

					<div class="flex flex-col gap-1 leading-4">
						<span class="font-semibold">
							{messagesModule.selectedChat?.brand?.businessName || messagesModule.selectedChat?.user?.businessName || ''}
						</span>

						<span class="text-sm">
							{messagesModule.selectedChat?.user?.fullName}
						</span>
					</div>
				</div>
			</div>

			<!-- Close chat -->

			<button
				type="button"
				class="text-primary-500 hover:text-primary-700 transition duration-300 focus:outline-none"
				onclick={() => {
					messagesModule.showChatInbox = false
					messagesModule.selectedChat = null
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="h-6 w-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
				</svg>
				<span class="sr-only">Close chat</span>
			</button>
		</div>

		<!-- All chats -->

		<div class="flex h-[400px] items-end overflow-y-auto">
			<div bind:this={messagesModule.mobileScrollRef} class="flex h-[400px] w-full flex-col gap-2 overflow-auto p-5">
				{#if messagesModule.selectedChat?.messages?.length}
					{#each messagesModule.selectedChat?.messages as m, idx (m?.id)}
						<div
							class="flex w-full flex-col gap-0.5
							{m?.message?.from == messagesModule.me?.id ? 'items-end justify-end' : 'items-start justify-start'}"
						>
							{#if m?.message?.img}
								<img src={m?.message?.img} alt="img {m?.message?.created_at}" class="h-20 w-auto object-contain object-bottom" />
							{/if}

							{#if m?.message?.message}
								<div
									class="max-w-[70%] rounded-md px-3 py-1.5 text-sm min-w-[{date(m?.message?.created_at).length + 10}px] flex flex-col border shadow
									{m?.message?.from === messagesModule.me?.id ? 'bg-gray-50' : 'text-primary-700 bg-inherit'}"
								>
									<div class={m?.message?.from == messagesModule.me?.id ? 'self-end' : 'self-start'}>
										{@html m?.message?.message}
									</div>
									<div class="ml-auto text-xs text-gray-400 {m?.message?.from == messagesModule.me?.id ? 'self-end' : 'self-start'}">
										{date(m?.message?.created_at)}
									</div>

									<!-- <div class="hidden">
										{idx === selectedChat?.messages?.length - 1 ? scrollToBottom(mobileScrollRef): ''}
									</div> -->
								</div>
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Typing area -->
		<form
			onsubmit={messagesModule.sendMessage}
			class="sticky inset-x-0 bottom-0 flex flex-col justify-between gap-1 border-b border-t bg-inherit p-5"
		>
			<!-- {#if lazyTipex}
				{#await lazyTipex then { default: LazyTipex }}
					<LazyTipex placeholder="Type a message" bind:textContent={newMessage.message} class="max-h-[10vh]" />
				{/await}
			{/if} -->
			<Textarea
				placeholder="Type a message"
				bind:value={messagesModule.newMessage.message}
				class="h-16 w-full bg-inherit py-3 pr-5 focus:outline-none"
			/>

			<button type="submit" id="send_new_message" class="mt-3 flex w-full items-center justify-center gap-2 border px-3 py-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					viewBox="0 0 24 24"
					stroke-width="1"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4"></path>
				</svg>
				Send
			</button>
		</form>
	{:else if messagesModule.filteredAllChats?.length}
		<!-- Chat counts with chat inbox close button -->

		<div class="relative flex h-16 w-full items-center border-b">
			<div class="w-full text-center font-semibold">
				Chat ({messagesModule.chatsCount})
			</div>
		</div>

		<!-- Search messages -->

		<div class="flex h-16 items-center border-b">
			<div class="flex h-16 w-16 items-center justify-center">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="h-5 w-5">
					<path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					></path>
				</svg>
			</div>

			<input
				type="text"
				name=""
				id=""
				placeholder="Search Messages"
				class="h-full w-full bg-inherit py-3 pr-5 focus:outline-none"
				bind:value={messagesModule.searchValue}
			/>
		</div>

		<!-- All chat users list -->

		<div class="h-[522px]">
			<ul class="m-0 flex h-full list-none flex-col divide-y overflow-y-auto pb-60">
				{#each messagesModule.filteredAllChats as chat}
					<li>
						<button
							type="button"
							class="hover:bg-primary-50 flex w-full items-center justify-between gap-5 px-5 py-3 text-left transition duration-300 focus:outline-none"
							onclick={() => messagesModule.handleSelectedChatInbox(chat)}
						>
							{#if chat}
								<div class="flex flex-1 items-center gap-5">
									{#if chat?.chat?.logo}
										<img src={chat?.chat?.logo} height="48" alt="avatar" width="48" class="h-12 w-12 rounded-full object-cover object-center" />
									{:else}
										<div class="bg-primary-50 h-12 w-12 rounded-full"></div>
									{/if}

									<div class="flex-1 truncate">
										{chat?.chat?.businessName || chat?.user?.fullName || chat?.user?.businessName}
									</div>
								</div>

								<!-- Unread messages count -->

								{#if !chat?.messages[chat?.messages?.length - 1]?.message?.seen}
									<div class="bg-brand-500 h-2 w-2 rounded-full"></div>
								{/if}
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{:else}
		<div class="flex h-full w-full flex-col items-center justify-center gap-5 p-5 text-center">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="h-8 w-8">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
				></path>
			</svg>

			<span>You have no messages</span>
		</div>
	{/if}
</div>

<!-- Desktop chat ui -->

<div class="hidden h-[650px] items-start justify-start divide-x rounded-lg border text-sm xl:flex">
	<!-- The chats list -->

	<div class="w-80">
		<!-- Chat counts with chat inbox close button -->

		<div class="relative flex h-16 w-full items-center border-b">
			<div class="w-full text-center font-semibold">
				Chat ({messagesModule.chatsCount})
			</div>
		</div>

		<!-- Search messages -->

		<div class="flex h-16 items-center border-b">
			<div class="flex h-16 w-16 items-center justify-center">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="h-5 w-5">
					<path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					></path>
				</svg>
			</div>

			<input
				type="text"
				name=""
				id=""
				placeholder="Search Messages"
				class="h-full w-full bg-inherit py-3 pr-5 focus:outline-none"
				bind:value={messagesModule.searchValue}
			/>
		</div>

		<!-- All chat users list -->

		{#if messagesModule.filteredAllChats?.length}
			<div class="h-[522px]">
				<ul class="m-0 flex h-full list-none flex-col divide-y overflow-y-auto pb-60">
					{#each messagesModule.filteredAllChats as chat}
						<li>
							<button
								type="button"
								class="hover:bg-primary-50 flex w-full items-center justify-between gap-5 px-5 py-3 text-left transition duration-300 focus:outline-none"
								onclick={() => messagesModule.handleSelectedChatInbox(chat)}
							>
								{#if chat}
									<div class="flex flex-1 items-center gap-5">
										{#if chat?.user?.avatar}
											<img src={chat?.user?.avatar} alt="avatar" height="48" width="48" class="h-12 w-12 rounded-full object-cover object-center" />
										{:else}
											<div class="bg-primary-50 h-12 w-12 rounded-full"></div>
										{/if}

										<div class="flex-1 truncate">
											{chat?.brand?.businessName || chat?.user?.fullName || chat?.user?.businessName}
										</div>
									</div>

									<!-- Unread messages count -->

									{#if !chat?.messages[chat?.messages?.length - 1]?.message?.seen}
										<div class="bg-brand-500 h-2 w-2 rounded-full"></div>
									{/if}
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{:else if messagesModule.loadingForChats}
			<div class="flex flex-col gap-5 p-5">
				<div class="bg-primary-50 h-16 w-full animate-pulse"></div>

				<ul class="m-0 flex list-none flex-col gap-5 p-0">
					{#each { length: 5 } as _}
						<li>
							<Skeleton />
						</li>
					{/each}
				</ul>
			</div>
		{:else}
			<div class="flex h-full w-full flex-col items-center justify-center gap-5 p-5 text-center">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="h-8 w-8">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
					></path>
				</svg>

				<span>No chat found</span>
			</div>
		{/if}
	</div>

	<div class="relative h-[650px] w-full flex-1 overflow-y-auto">
		{#if messagesModule.loading}
			<div class="flex flex-col gap-5 p-5">
				<div class="bg-primary-50 h-16 w-full animate-pulse"></div>

				<ul class="m-0 flex list-none flex-col gap-5 p-0">
					{#each { length: 5 } as _}
						<li>
							<Skeleton />
						</li>
					{/each}
				</ul>
			</div>
		{:else if messagesModule.selectedChat}
			<!-- The chat inbox -->
			<div class="flex h-full flex-col justify-end">
				<div bind:this={messagesModule.desktopScrollRef} class="flex w-full flex-col gap-2 overflow-auto p-5">
					{#if messagesModule.selectedChat?.messages?.length}
						{#each messagesModule.selectedChat?.messages as m, idx (m?.id)}
							<div
								class="flex w-full flex-col gap-0.5
							{m.message?.from == messagesModule.me?.id ? 'items-end justify-end' : 'items-start justify-start'}"
							>
								{#if m.message?.img}
									<img src={m.message?.img} alt="img {m.message?.updatedAt}" class="h-20 w-auto object-contain object-bottom" />
								{/if}

								{#if m.message?.message}
									<div
										class="max-w-[70%] rounded-md px-3 py-1.5 text-sm min-w-[{date(m.message?.updatedAt).length + 10}px] flex flex-col border shadow
									{m.message?.from === messagesModule.me?.id ? 'bg-gray-50' : 'text-primary-700 bg-inherit'}"
									>
										<div class={m.message?.from == messagesModule.me?.id ? 'self-end' : 'self-start'}>
											{@html m.message?.message}
										</div>
										<div class="ml-auto text-xs text-gray-400 {m.message?.from == messagesModule.me?.id ? 'self-end' : 'self-start'}">
											{date(m.message?.updatedAt)}
										</div>

										<!-- <div class="hidden">
										{idx === selectedChat?.messages?.length - 1 ? scrollToBottom(desktopScrollRef): ''}
									</div> -->
									</div>
								{/if}
							</div>
						{/each}
					{/if}
				</div>

				<!-- Typing area -->
				<form onsubmit={messagesModule.sendMessage} class="inset-x-0 bottom-0 flex flex-col justify-between gap-1 border-b border-t bg-inherit p-5">
					<!-- {#if lazyTipex2}
						{#await lazyTipex2 then { default: LazyTipex2 }}
							<LazyTipex2 placeholder="Type a message" bind:textContent={newMessage.message} class="max-h-[10vh]" />
						{/await}
					{/if} -->
					<Textarea
						placeholder="Type a message"
						bind:value={messagesModule.newMessage.message}
						class="h-16 w-full bg-inherit py-3 pr-5 focus:outline-none"
					/>

					<button type="submit" id="send_new_message" class="mt-3 flex w-full items-center justify-center gap-2 border px-3 py-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							viewBox="0 0 24 24"
							stroke-width="1"
							stroke="currentColor"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4"></path>
						</svg>
						Send
					</button>
				</form>
			</div>
		{:else}
			<div class="flex h-full flex-col items-center justify-center gap-2 text-center font-medium">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="h-6 w-6">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
					></path>
				</svg>

				<span> Select a conversation </span>
			</div>
		{/if}
	</div>
</div>

