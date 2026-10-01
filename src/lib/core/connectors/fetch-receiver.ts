// The connectors' BaseService stores a fetch on the instance (`this._fetch = fetchFn || fetch`) and
// calls it as a method, `this._fetch(url)`. When the stored function is the browser's native fetch,
// that call has the service as its receiver, and Chrome throws "Failed to execute 'fetch' on
// 'Window': Illegal invocation". safeFetch reports it as "Please check your internet connection",
// so the menu, the product rails and the stored bag silently fail to load. Whether a service holds
// the native function depends on when it was built, so pages came up empty at random after a reload.
//
// The connector packages are not edited here, so this wraps their one call site instead: before
// safeFetch runs, the stored fetch is swapped for one that always calls it with the global object
// as receiver. A fetch passed in by a load function (SvelteKit's) does not care about its receiver,
// so it behaves exactly as before.

const BOUND = Symbol('fetch-bound-to-global')

type FetchHolder = { _fetch?: unknown; safeFetch?: (url: string, data?: unknown) => Promise<unknown> }
type BoundFetch = ((input: unknown, init?: unknown) => unknown) & { [BOUND]?: true }

export function bindFetchReceiver(BaseService: { prototype: object }) {
	const proto = BaseService.prototype as FetchHolder & { [BOUND]?: true }
	const original = proto.safeFetch
	if (typeof original !== 'function' || proto[BOUND]) return
	proto[BOUND] = true

	proto.safeFetch = function (this: FetchHolder, url: string, data?: unknown) {
		const own = this._fetch as BoundFetch | undefined
		if (typeof own === 'function' && !own[BOUND]) {
			const bound: BoundFetch = (input, init) => own.call(globalThis, input, init)
			bound[BOUND] = true
			this._fetch = bound
		}
		return original.call(this, url, data)
	}
}

const ownsSafeFetch = (value: unknown): value is { prototype: object } =>
	typeof value === 'function' && !!value.prototype && Object.prototype.hasOwnProperty.call(value.prototype, 'safeFetch')

/**
 * The connector's BaseService. Litekart 2.0.x does not export it, but every exported service class
 * extends it, so it is found as the parent that owns `safeFetch`. Matched by shape rather than by
 * name, because a production build minifies class names.
 */
export function baseServiceIn(moduleExports: Record<string, unknown>): { prototype: object } | undefined {
	if (ownsSafeFetch(moduleExports.BaseService)) return moduleExports.BaseService
	for (const value of Object.values(moduleExports)) {
		if (typeof value !== 'function') continue
		const parent = Object.getPrototypeOf(value)
		if (ownsSafeFetch(parent)) return parent
	}
	return undefined
}
