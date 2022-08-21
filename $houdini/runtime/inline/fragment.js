import { wrapPaginationStore } from '../lib/pagination';
export function fragment(fragment, ref) {
    // make sure we got a query document
    if (fragment.kind !== 'HoudiniFragment' || false) {
        throw new Error('getFragment can only take fragment documents');
    }
    // load the fragment store for the value
    const store = fragment.store.get(ref);
    // make sure the store always stays up to date with the fragment value
    fragment.proxy.listen((val) => {
        // update the fragment value to match the new value
        store.update(val);
    });
    return {
        ...store,
        data: { subscribe: store.subscribe },
    };
    // the following block of comments is from a time when fragments had their own subscriptions
    // since a query subscribes to its full selection this isn't necessary but will be in the future
    // once we optimize subscriptions to only be for the direct selection set. so i'm leaving it
    // here for now
    // @ts-ignore: typing esm/cjs interop is hard
    // const artifact: FragmentArtifact = fragment.artifact.default || fragment.artifact
    // const queryVariables = getVariables()
    // @ts-ignore: isn't properly typed yet to know if initialValue has the right values
    // const parentID = cache._internal_unstable.id(artifact.rootType, initialValue)
    // let spec: SubscriptionSpec | null = null
    // a fragment has to subscribe individually because svelte can't detect that a prop has changed
    // if there is an object passed
    // let spec: SubscriptionSpec | null = null
    // // wrap the result in a store we can use to keep this query up to date
    // const store = writable(initialValue, (set) => {
    // 	// if we couldn't compute the parent of the fragment
    // 	if (!parentID) {
    // 		return
    // 	}
    // 	spec = {
    // 		rootType: artifact.rootType,
    // 		selection: artifact.selection,
    // 		set,
    // 		parentID,
    // 		variables: queryVariables,
    // 	}
    // 	// when the component mounts
    // 	onMount(() => {
    // 		// stay up to date
    // 		cache.subscribe(spec!, queryVariables())
    // 	})
    // 	// the function used to clean up the store
    // 	return () => {
    // 		// if there is no subscription spec, there's nothing to subscribe from
    // 		if (!spec) {
    // 			return
    // 		}
    // 		// if we subscribed to something we'll need to clean up
    // 		cache.unsubscribe(spec, queryVariables())
    // 	}
    // })
    // whenever the fragment proxy gives us a new value for the fragment we need to
    // update the store's value and possible subscribe to new data
    // fragment.proxy.listen((val: _Fragment) => {
    // 	// compute the new parent ID
    // 	// @ts-ignore: id isn't properly typed yet to know if initialValue has the right values
    // 	const newParent = cache._internal_unstable.id(artifact.rootType, val)
    // 	if (!spec || !newParent) {
    // 		return
    // 	}
    // 	// if the parent ID has changed
    // 	if (newParent !== parentID) {
    // 		const variables = queryVariables()
    // 		// subscribe from the old parent
    // 		cache.unsubscribe(spec, variables)
    // 		// update the spec and resubscribe
    // 		spec.parentID = newParent
    // 		cache.subscribe(spec, variables)
    // 	}
    // })
}
export function paginatedFragment(document, initialValue) {
    var _a;
    // make sure we got a query document
    if (document.kind !== 'HoudiniFragment') {
        throw new Error('paginatedFragment() must be passed a fragment document');
    }
    // if we don't have a pagination fragment there is a problem
    if (!((_a = document.artifact.refetch) === null || _a === void 0 ? void 0 : _a.paginated)) {
        throw new Error('paginatedFragment must be passed a fragment with @paginate');
    }
    // TODO: fix type checking paginated
    // @ts-ignore: the query store will only include the methods when it needs to
    // and the userland type checking happens as part of the query type generation
    return wrapPaginationStore(fragment(document, initialValue));
}
