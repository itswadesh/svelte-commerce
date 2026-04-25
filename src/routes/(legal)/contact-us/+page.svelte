<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Textarea } from '$lib/components/ui/textarea'
	import { Check, AlertCircle, Mail, MessageSquare, Phone, MapPin, Send, Clock, ArrowRight } from '@lucide/svelte'
	import { page } from '$app/state'
	import { ContactUsRenderer } from '$lib/core/composables/index.js'
	import { fade, fly } from 'svelte/transition'

	let info = $state({
		name: '',
		email: '',
		message: ''
	})

	const contactMethods = [
		{
			icon: Mail,
			title: 'Email',
			value: page?.data?.store?.businessEmail || 'support@sveltecommerce.com',
			description: 'Our team will respond within 24 hours.'
		},
		{
			icon: MessageSquare,
			title: 'Live Chat',
			value: 'Available 9am - 6pm',
			description: 'Average response time: 5 minutes.'
		}
	]
</script>

<svelte:head>
	<title>Contact Us | Svelte Commerce</title>
</svelte:head>

<div class="min-h-screen bg-[#fafafa] py-12 md:py-24">
	<div class="container mx-auto max-w-6xl px-4">
		<ContactUsRenderer bind:info>
			{#snippet content({ error, success, nameError, messageError, emailError, loading, handleSubmit })}
				<div class="grid gap-12 lg:grid-cols-12 lg:items-start">
					
					<!-- Left Column: Content & Info -->
					<div class="lg:col-span-5" in:fly={{ x: -20, duration: 600 }}>
						<div class="mb-10">
							<h1 class="text-4xl font-black tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
								Let's Start a <span class="text-primary">Conversation</span>
							</h1>
							<p class="mt-6 text-lg leading-relaxed text-gray-500">
								Have a question about an order or just want to say hi? We're here to help you create the perfect shopping experience.
							</p>
						</div>

						<!-- Contact Methods Grid -->
						<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
							{#each contactMethods as method}
								<div class="group flex items-start gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
									<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
										<method.icon class="h-6 w-6" />
									</div>
									<div>
										<h3 class="font-bold text-gray-900">{method.title}</h3>
										<p class="mt-1 font-medium text-primary">{method.value}</p>
										<p class="mt-1 text-sm text-gray-400">{method.description}</p>
									</div>
								</div>
							{/each}
						</div>

						<!-- Socials or Additional Info -->
						<div class="mt-10 border-t border-gray-100 pt-10">
							<div class="prose-lg text-sm leading-relaxed text-gray-400 prose-p:my-0 prose-li:my-0">
								{@html page?.data?.page?.content}
							</div>
						</div>
					</div>

					<!-- Right Column: Form -->
					<div class="lg:col-span-7" in:fly={{ x: 20, duration: 600, delay: 200 }}>
						{#if success}
							<div in:fade class="flex min-h-[500px] flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl md:p-12">
								<div class="relative mb-8">
									<div class="absolute inset-0 scale-150 animate-ping rounded-full bg-green-100 opacity-20"></div>
									<div class="relative flex h-20 w-24 items-center justify-center rounded-full bg-green-50">
										<Check class="h-10 w-10 text-green-600" />
									</div>
								</div>
								<h2 class="text-3xl font-bold text-gray-900">Message Sent!</h2>
								<p class="mt-4 max-w-sm text-lg text-gray-500">
									Thank you for reaching out. A member of our team will get back to you shortly.
								</p>
								<!-- <Button 
									variant="outline" 
									class="mt-10 h-12 px-8 font-bold uppercase tracking-widest transition-all hover:bg-gray-50"
									onclick={() => { success = false
										 info = { name: '', email: '', message: '' } }}
								>
									Send Another Message
								</Button> -->
							</div>
						{:else}
							<div class="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
								<div class="bg-gray-50/50 p-8 md:p-10">
									<h2 class="text-2xl font-bold text-gray-900">Send us a message</h2>
									<p class="mt-2 text-gray-500">Required fields are marked with an asterisk (*)</p>
								</div>

								<form class="p-8 space-y-6 md:p-10" onsubmit={handleSubmit}>
									{#if error}
										<div class="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-600" in:fade>
											<AlertCircle class="h-5 w-5 shrink-0" />
											<p class="text-sm font-medium">{error}</p>
										</div>
									{/if}

									<div class="grid gap-6 sm:grid-cols-2">
										<div class="space-y-2">
											<Label for="name" class="text-xs font-black uppercase tracking-widest text-gray-400">Full Name *</Label>
											<Input
												id="name"
												placeholder="John Doe"
												bind:value={info.name}
												class="h-12 border-gray-100 bg-gray-50/30 transition-all focus:bg-white focus:ring-primary/20 {nameError ? 'border-red-500 focus:ring-red-500/20' : ''}"
												required
											/>
											{#if nameError}
												<p class="text-[10px] font-bold uppercase tracking-tight text-red-500">{nameError}</p>
											{/if}
										</div>

										<div class="space-y-2">
											<Label for="email" class="text-xs font-black uppercase tracking-widest text-gray-400">Email Address *</Label>
											<Input
												id="email"
												type="email"
												placeholder="john@example.com"
												bind:value={info.email}
												class="h-12 border-gray-100 bg-gray-50/30 transition-all focus:bg-white focus:ring-primary/20 {emailError ? 'border-red-500 focus:ring-red-500/20' : ''}"
												required
											/>
											{#if emailError}
												<p class="text-[10px] font-bold uppercase tracking-tight text-red-500">{emailError}</p>
											{/if}
										</div>
									</div>

									<div class="space-y-2">
										<Label for="message" class="text-xs font-black uppercase tracking-widest text-gray-400">Your Message *</Label>
										<Textarea
											id="message"
											placeholder="Tell us how we can help..."
											rows={5}
											class="min-h-[150px] resize-none border-gray-100 bg-gray-50/30 transition-all focus:bg-white focus:ring-primary/20 {messageError ? 'border-red-500 focus:ring-red-500/20' : ''}"
											bind:value={info.message}
											required
										/>
										{#if messageError}
											<p class="text-[10px] font-bold uppercase tracking-tight text-red-500">{messageError}</p>
										{/if}
									</div>

									<Button 
										type="submit" 
										class="group h-14 w-full text-base font-bold uppercase tracking-[0.2em] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]" 
										disabled={loading}
									>
										{#if loading}
											<div class="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
											Processing...
										{:else}
											<Send class="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
											Send Message
										{/if}
									</Button>

									<p class="text-center text-[10px] font-medium text-gray-400">
										By clicking "Send Message", you agree to our 
										<a href="/terms-and-conditions" class="text-primary hover:underline">Terms</a> and 
										<a href="/privacy-policy" class="text-primary hover:underline">Privacy Policy</a>.
									</p>
								</form>
							</div>
						{/if}
					</div>
				</div>
			{#if !success}
				<div class="mt-24 grid gap-8 border-t border-gray-100 pt-16 sm:grid-cols-3">
					<div class="flex items-center gap-4">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
							<Clock class="h-5 w-5 text-gray-400" />
						</div>
						<div>
							<h4 class="text-sm font-bold text-gray-900">Support Hours</h4>
							<p class="text-xs text-gray-500">Mon - Fri: 9am - 6pm EST</p>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
							<MapPin class="h-5 w-5 text-gray-400" />
						</div>
						<div>
							<h4 class="text-sm font-bold text-gray-900">Global Offices</h4>
							<p class="text-xs text-gray-500">NY, London, Tokyo</p>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
							<Check class="h-5 w-5 text-gray-400" />
						</div>
						<div>
							<h4 class="text-sm font-bold text-gray-900">Quick Response</h4>
							<p class="text-xs text-gray-500">Guaranteed 24h turnaround</p>
						</div>
					</div>
				</div>
			{/if}
			{/snippet}
		</ContactUsRenderer>
	</div>
</div>

<style>
	:global(body) {
		background-color: #fafafa;
	}
</style>
