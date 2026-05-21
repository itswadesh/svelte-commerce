<script lang="ts">
	import { Award, RotateCcw, ShieldCheck } from '@lucide/svelte'
</script>

<div class="grid grid-cols-3 gap-2">
	<div
		class="flex flex-col items-center justify-center gap-2.5 rounded-md border border-gray-100 bg-gray-50/50 py-4 text-center transition-all"
	>
		<ShieldCheck class="h-10 w-10 text-gray-400" strokeWidth={1.5} />
		<div class="flex flex-col gap-1">
			<span class="text-sm font-bold uppercase leading-none tracking-tight text-gray-900">100% Secure</span>
			<span class="text-xs font-medium uppercase leading-none tracking-tighter text-gray-400">Payments</span>
		</div>
	</div>

	<div
		class="flex flex-col items-center justify-center gap-2.5 rounded-md border border-gray-100 bg-gray-50/50 py-4 text-center transition-all"
	>
		<RotateCcw class="h-10 w-10 text-gray-400" strokeWidth={1.5} />
		<div class="flex flex-col gap-1">
			<span class="text-sm font-bold uppercase leading-none tracking-tight text-gray-900">Easy</span>
			<span class="text-xs font-medium uppercase leading-none tracking-tighter text-gray-400">Returns</span>
		</div>
	</div>

	<div
		class="flex flex-col items-center justify-center gap-2.5 rounded-md border border-gray-100 bg-gray-50/50 py-4 text-center transition-all"
	>
		<Award class="h-10 w-10 text-gray-400" strokeWidth={1.5} />
		<div class="flex flex-col gap-1">
			<span class="text-sm font-bold uppercase leading-none tracking-tight text-gray-900">Quality</span>
			<span class="text-xs font-medium uppercase leading-none tracking-tighter text-gray-400">Assurance</span>
		</div>
	</div>
</div>
