<script lang="ts">
import {LazyImg} from '$lib/components'

export let students, tests, schools, results
</script>

<div class="mb-4 grid grid-cols-1 shadow lg:grid-cols-3">
	<div class="stat">
		<!-- <div class="stat-figure text-secondary">
      <div class="avatar online">
        <div class="w-16 rounded-full">
          <LazyImg src="https://placeimg.com/128/128/people" alt="" class="" />
        </div>
      </div>
    </div> -->
		<div class="stat-title">Total Students</div>
		<div class="text-primary stat-value">{students.length}</div>
		<div class="stat-desc">21% more than last month</div>
	</div>

	<div class="stat">
		<div class="text-secondary stat-figure">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="inline-block h-8 w-8 stroke-current"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 10V3L4 14h7v7l9-11h-7z"></path
				></svg>
		</div>
		<div class="stat-title">Published Results</div>
		<div class="text-secondary stat-value">{results?.length}</div>
		<div class="stat-desc">Out of {tests?.length} tests</div>
	</div>
	<!-- {#if results?.length}
    <div class="stat">
      <div class="stat-figure text-secondary">
        <div class="avatar online">
          <div class="w-16 rounded-full">
            <LazyImg src="https://placeimg.com/128/128/people" />
          </div>
        </div>
      </div>
      <div class="stat-value">{results.length}</div>
      <div class="stat-title">Results</div>
      <div class="stat-desc text-secondary">31 tasks remaining</div>
    </div>
  {/if} -->
	{#if schools?.length}
		<div class="stat">
			<div class="text-secondary stat-figure">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="inline-block h-8 w-8 stroke-current"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"></path
					></svg>
			</div>
			<!-- <div class="stat-figure text-secondary">
        <div class="avatar online">
          <div class="w-16 rounded-full">
            <LazyImg src="https://placeimg.com/128/128/people" />
          </div>
        </div>
      </div> -->
			<div class="stat-value">{schools.length}</div>
			<div class="stat-title">Schools</div>
			<div class="text-secondary stat-desc">31 tasks remaining</div>
		</div>
	{/if}
</div>
