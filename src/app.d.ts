/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
	// interface Platform {}
	// interface Stuff {}
	interface Locals {}

	interface Platform {
		context: {
			waitUntil(promise: Promise<any>): void
		}
		caches: CacheStorage & { default: Cache }
	}

	interface Session {}

	interface Stuff {}
}
