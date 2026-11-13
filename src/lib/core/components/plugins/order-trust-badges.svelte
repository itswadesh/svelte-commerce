<script lang="ts">
	import { Award, RotateCcw, ShieldCheck } from '@lucide/svelte'
</script>

<!-- One short strip: three 110px tiles of 40px icons pushed the cart's total a screen down on phones. -->
<div class="grid grid-cols-3 gap-2">
	{#each [{ icon: ShieldCheck, top: '100% Secure', bottom: 'Payments' }, { icon: RotateCcw, top: 'Easy', bottom: 'Returns' }, { icon: Award, top: 'Quality', bottom: 'Assurance' }] as badge (badge.top)}
		<div class="flex items-center justify-center gap-1.5 rounded-md border border-border bg-muted/40 px-1 py-2 sm:flex-col sm:gap-2 sm:py-3 sm:text-center">
			<badge.icon class="size-5 shrink-0 text-muted-foreground sm:size-7" strokeWidth={1.5} aria-hidden="true" />
			<div class="flex flex-col gap-0.5">
				<span class="text-[11px] font-bold uppercase leading-none tracking-tight text-foreground sm:text-xs">{badge.top}</span>
				<span class="text-[11px] font-medium uppercase leading-none tracking-tighter text-muted-foreground sm:text-xs">{badge.bottom}</span>
			</div>
		</div>
	{/each}
</div>
