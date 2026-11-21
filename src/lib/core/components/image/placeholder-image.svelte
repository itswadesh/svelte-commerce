<script lang="ts">
	export let w: string = '100'
	export let h: string = '100'
	export let aspect_ratio: string = '1:1'
</script>

<div
	class="animate-pulse bg-gray-100"
	style="height: {+h / 2}px;width: {+w / 2};aspect-ratio: {aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(':')[1]};"
>
	<svg class="h-full w-full text-gray-300" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
		<path d="M40 45 L60 45 L50 35 Z" class="fill-current" />
		<circle cx="45" cy="40" r="2" class="fill-current" />
		<path d="M30 60 L45 50 L60 65 L70 55" class="fill-none stroke-current stroke-[2]" />
	</svg>
</div>
