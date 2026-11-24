<script lang="ts">
	import { ChevronLeft } from '@lucide/svelte'

	let { href, label }: { href: string; label: string } = $props()
</script>

<!-- Phones and the installed app only (`in-app` is set in app.html). A desktop browser keeps the
     page as it was: its own Back button and the breadcrumb already do this job. Hidden by CSS, not
     by script, so the server's HTML is already right and nothing moves on hydration. -->
<a
	{href}
	class="-ml-2 inline-flex h-11 max-w-full items-center gap-1 self-start rounded-md pl-1 pr-3 text-sm font-semibold text-foreground transition-[transform,background-color] duration-fast ease-standard hover:bg-muted motion-safe:active:scale-[0.97] md:hidden [.in-app_&]:inline-flex"
	data-testid="back-to-category"
>
	<ChevronLeft class="size-5 shrink-0" aria-hidden="true" />
	<span class="truncate">{label}</span>
</a>
