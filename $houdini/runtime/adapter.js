import { goto as go } from '$app/navigation'
import { page, session } from '$app/stores';
import { get } from 'svelte/store';
import { browser, prerendering } from '$app/env'

export function getSession() {
    return session
}

export function getPage() {
	return page
}

export function goTo(location, options) {
    go(location, options)
}

export const isBrowser = browser

/**
 *  After `clientStarted = true`, only client side navigation will happen.
 */
export let clientStarted = false; // Will be true on a client side navigation
if (browser) {
  addEventListener('sveltekit:start', () => {
    clientStarted = true;
  });
}

export const isPrerender = prerendering
