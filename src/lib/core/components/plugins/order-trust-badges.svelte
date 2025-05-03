<script lang="ts">
	import { Award, RotateCcw, ShieldCheck } from 'lucide-svelte'
</script>

<div class="w-full rounded-lg border border-slate-200 bg-white">
	<div class="grid grid-cols-1 divide-y divide-slate-200">
		<div class="flex items-center justify-center px-4 py-2">
			<div class="flex w-full items-center">
				<div class="mr-3 text-emerald-600">
					<ShieldCheck class="h-8 w-8" strokeWidth={1.5} />
				</div>
				<div>
					<h3 class="text-sm font-semibold text-slate-800">100% SECURE PAYMENTS</h3>
					<p class="mt-0.5 text-xs text-slate-500">All major cards accepted</p>
				</div>
			</div>
		</div>

		<div class="flex items-center justify-center px-4 py-2">
			<div class="flex w-full items-center">
				<div class="mr-3 text-slate-700">
					<RotateCcw class="h-8 w-8" strokeWidth={1.5} />
				</div>
				<div>
					<h3 class="text-sm font-semibold text-slate-800">EASY RETURNS</h3>
					<p class="mt-0.5 text-xs text-slate-500">30-day money back guarantee</p>
				</div>
			</div>
		</div>

		<div class="flex items-center justify-center px-4 py-2">
			<div class="flex w-full items-center">
				<div class="mr-3 text-amber-500">
					<Award class="h-8 w-8" strokeWidth={1.5} />
				</div>
				<div>
					<h3 class="text-sm font-semibold text-slate-800">QUALITY ASSURANCE</h3>
					<p class="mt-0.5 text-xs text-slate-500">Certified authentic products</p>
				</div>
			</div>
		</div>
	</div>
</div>
