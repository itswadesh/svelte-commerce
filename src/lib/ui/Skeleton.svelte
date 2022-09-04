<style>
.small-box {
	@apply h-14 w-14 sm:h-20 sm:w-20;
}
.extra-small-box {
	@apply h-7 w-7 sm:h-14 sm:w-14;
}
.small-gaping {
	@apply gap-2 sm:gap-3;
}
.extra-small-gaping {
	@apply gap-1 sm:gap-2;
}
.small-line {
	@apply h-2 sm:h-3;
}
.extra-small-line {
	@apply h-1 sm:h-1.5;
}
</style>

<script>
export let small = false,
	extraSmall = false
</script>

<div class="flex w-full animate-pulse gap-5" class:gap-3="{small}" class:gap-2="{extraSmall}">
	<div
		class="h-24 w-24 rounded-md bg-gray-200 sm:h-40 sm:w-40"
		class:small-box="{small}"
		class:extra-small-box="{extraSmall}">
	</div>

	<div
		class="flex w-full flex-1 flex-col gap-3 sm:gap-4"
		class:small-gaping="{small}"
		class:extra-small-gaping="{extraSmall}">
		<div
			class="h-3 w-4/5 rounded-md bg-gray-200 sm:h-5"
			class:small-line="{small}"
			class:extra-small-line="{extraSmall}">
		</div>

		<div
			class="h-3 w-3/5 rounded-md bg-gray-200 sm:h-5"
			class:small-line="{small}"
			class:extra-small-line="{extraSmall}">
		</div>

		<div
			class="h-3 w-2/6 rounded-md bg-gray-200 sm:h-5"
			class:small-line="{small}"
			class:extra-small-line="{extraSmall}">
		</div>
	</div>
</div>
