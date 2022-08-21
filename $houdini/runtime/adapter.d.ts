import type { Page } from '@sveltejs/kit';
import type { Readable, Writable } from 'svelte/store';
export declare function getSession(): Writable<App.Session | null>;
export declare function getPage(): Readable<Page>;
export declare function goTo(href: string, opts?: {
    replaceState?: boolean;
    noscroll?: boolean;
    keepfocus?: boolean;
    state?: any;
}): Promise<void>;
export declare const isBrowser = false;
/**
 *  After `clientStarted = true`, only client side navigation will happen.
 */
export declare let clientStarted: boolean;
export declare let isPrerender: boolean;
