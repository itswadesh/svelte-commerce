// externals
import { derived, get, readable } from 'svelte/store';
// internals
import { CachePolicy, DataSource, fetchQuery } from '..';
import { clientStarted, getSession, isBrowser } from '../adapter';
import cache from '../cache';
import { deepEquals, } from '../lib';
import { nullHoudiniContext } from '../lib/context';
import { queryHandlers } from '../lib/pagination';
import { marshalInputs, unmarshalSelection } from '../lib/scalars';
import * as log from '../lib/log';
import { currentReqID, sessionStore } from '../lib/session';
export function queryStore({ config, artifact, storeName, paginationMethods, paginated, }) {
    // at its core, a query store is a writable store with extra methods
    const data = {};
    const setFetching = (reqID, isFetching) => { var _a; return (_a = data[reqID]) === null || _a === void 0 ? void 0 : _a.update((s) => ({ ...s, isFetching })); };
    const getVariables = (reqID) => { var _a; return ((_a = get(data[reqID])) === null || _a === void 0 ? void 0 : _a.variables) || null; };
    // the first client-side request after the mocked load() needs to be blocked
    let blockNextCSF = false;
    // we will be reading and write the last known variables often, avoid frequent gets and updates
    let lastVariables = null;
    // track the subscription's existence to refresh and unsubscribe when unmounting
    let subscriptionSpec = null;
    // if there is a load in progress when the CSF triggers we need to stop it
    let loadPending = false;
    // in order to clear the store's value when unmounting, we need to track how many concurrent subscribers
    // we have. when this number is 0, we need to clear the store
    let subscriberCount = {};
    // a function to update the store's cache subscriptions
    function refreshSubscription(reqID, newVariables) {
        // if the variables changed we need to unsubscribe from the old fields and
        // listen to the new ones
        if (subscriptionSpec) {
            cache.unsubscribe(subscriptionSpec, lastVariables || {});
        }
        // subscribe to cache updates
        subscriptionSpec = {
            rootType: artifact.rootType,
            selection: artifact.selection,
            variables: () => newVariables,
            set: (newValue) => { var _a; return (_a = data[reqID]) === null || _a === void 0 ? void 0 : _a.update((s) => ({ ...s, data: newValue })); },
        };
        // make sure we subscribe to the new values
        cache.subscribe(subscriptionSpec, newVariables);
        // track the newVariables
        lastVariables = newVariables;
    }
    // a function to fetch data (the root of the behavior tree described above)
    async function fetch(args) {
        // validate and prepare the request context for the current environment (client vs server)
        const { context, policy, params } = fetchContext(artifact, storeName, args);
        // get the appropriate store for the session
        const store = sessionQueryStore(context.session, data);
        const reqID = currentReqID(context.session, data);
        // identify if this is a CSF or load
        const isLoadFetch = Boolean('event' in params && params.event);
        const isComponentFetch = !isLoadFetch;
        // compute the variables we need to use for the query
        const input = (marshalInputs({
            artifact,
            config,
            input: params === null || params === void 0 ? void 0 : params.variables,
        }) || {});
        const newVariables = {
            ...lastVariables,
            ...input,
        };
        // check if the variables are different from the last time we saw them
        let variableChange = !deepEquals(lastVariables, newVariables);
        // detect if there is a load function that fires before the first CSF
        if (isLoadFetch && lastVariables === null && Boolean('event' in (args || {}))) {
            blockNextCSF = true;
        }
        // if we are loading on the client and the variables _are_ different, we have to
        // update the subscribers. do that before the fetch so we don't accidentally
        // cause the new data to trigger the old subscription after the store has been
        // update with fetchAndCache
        if (isComponentFetch && variableChange) {
            refreshSubscription(reqID, newVariables);
            store.update((s) => ({ ...s, variables: newVariables }));
        }
        // if there is a pending load, don't do anything
        if (loadPending && isComponentFetch) {
            // if the variables haven't changed and we dont have an active subscription
            // then we need to start listening
            if (!variableChange && subscriptionSpec === null) {
                refreshSubscription(reqID, newVariables);
            }
            // we've officially blocked a CSF
            blockNextCSF = false;
            return get(store);
        }
        if (isComponentFetch) {
            // a component fetch is _always_ blocking
            params.blocking = true;
        }
        // the fetch is happening in a load
        if (isLoadFetch) {
            loadPending = true;
        }
        // there are a few cases where the CSF needs to be prevented:
        // - the last request was from a server-side rendered request (faked by svelte kit)
        // - the variables didn't change and we're not being forced to request it
        // - there is a pending load function
        if (isComponentFetch &&
            (blockNextCSF ||
                (!variableChange && params.policy !== CachePolicy.NetworkOnly) ||
                loadPending)) {
            blockNextCSF = false;
            // if the variables didn't change, get the latest value and use that
            if (!variableChange) {
                await fetchAndCache({
                    config,
                    context,
                    artifact,
                    variables: newVariables,
                    store: store,
                    updateStore: true,
                    cached: true,
                    policy: CachePolicy.CacheOnly,
                    setLoadPending: (val) => {
                        loadPending = val;
                        setFetching(reqID, val);
                    },
                });
            }
            // if we dont have a subscription but we're ending early we need to listen for
            // changes
            if (subscriptionSpec === null) {
                refreshSubscription(reqID, newVariables);
            }
            // make sure we return before the fetch happens
            return get(store);
        }
        // we want to update the store in four situations: ssr, csf, the first load of the ssr response,
        // or if we got this far and the variables haven't changed (avoid prefetch)
        const updateStore = !isBrowser ||
            isComponentFetch ||
            (lastVariables === null && variableChange) ||
            !variableChange;
        // we might not want to wait for the fetch to resolve
        const fakeAwait = clientStarted && isBrowser && !(params === null || params === void 0 ? void 0 : params.blocking);
        setFetching(reqID, true);
        // perform the network request
        const request = fetchAndCache({
            config,
            context,
            artifact,
            variables: newVariables,
            store: store,
            updateStore,
            cached: policy !== CachePolicy.NetworkOnly,
            setLoadPending: (val) => {
                loadPending = val;
                setFetching(reqID, val);
            },
        });
        // if the await isn't fake, await it
        if (!fakeAwait) {
            await request;
        }
        // the store will have been updated already since we waited for the response
        return get(store);
    }
    // add the pagination methods to the store
    let extraMethods = {};
    let pageInfos = {};
    // a collection of functions to call when cleaning up
    let onUnsub = (key) => { };
    if (paginated) {
        const handlers = queryHandlers({
            storeName,
            config,
            artifact,
            stores: data,
            async fetch(params) {
                return (await fetch({
                    ...params,
                    blocking: true,
                }));
            },
            queryVariables: getVariables,
        });
        extraMethods = Object.fromEntries(paginationMethods.map((key) => [key, handlers[key]]));
        extraMethods.paginationStrategy = handlers.paginationStrategy;
        pageInfos = handlers.pageInfos;
        onUnsub = handlers.onUnsubscribe;
    }
    return {
        name: artifact.name,
        subscribe: (...args) => {
            var _a;
            // figure out the correct store to subscribe to
            const session = get(getSession());
            const store = sessionQueryStore(session, data);
            const reqID = currentReqID(session, data);
            // add the page info store if it exists
            const combined = derived([store, pageInfos[reqID] || readable(null)], ([$store, $pageInfo]) => {
                const everything = { ...$store };
                if ($pageInfo) {
                    everything.pageInfo = $pageInfo;
                }
                return everything;
            });
            const bubbleUp = combined.subscribe(...args);
            // we have a new subscriber
            subscriberCount[reqID] = ((_a = subscriberCount[reqID]) !== null && _a !== void 0 ? _a : 0) + 1;
            // Handle unsubscribe
            return () => {
                // we lost a subscriber
                subscriberCount[reqID]--;
                // don't clear the store state on the server (breaks SSR)
                // or when there is still an active subscriber
                if (subscriberCount[reqID] <= 0) {
                    // clean up any cache subscriptions
                    if (isBrowser && subscriptionSpec) {
                        cache.unsubscribe(subscriptionSpec, lastVariables || {});
                        subscriptionSpec = null;
                    }
                    // clear the variable counter
                    lastVariables = null;
                    // reset the store value
                    delete data[reqID];
                    // clean up any pagination state
                    onUnsub(reqID);
                }
                // we're done
                bubbleUp();
            };
        },
        fetch,
        ...extraMethods,
    };
}
export function fetchContext(artifact, storeName, params) {
    var _a, _b, _c, _d;
    // if we aren't on the browser but there's no event there's a big mistake
    if (!isBrowser &&
        !(params && 'fetch' in params) &&
        (!params || !('event' in params) || !('fetch' in (params.event || {})))) {
        // prettier-ignore
        log.error(`
	${log.red(`Missing event args in load function`)}.

	Three options:
	${log.cyan('1/ Prefetching & SSR')}
	<script context="module" lang="ts">
		import type { LoadEvent } from '@sveltejs/kit';

		export async function load(${log.yellow('event')}: LoadEvent) {
			const variables = { ... };
			await ${log.cyan(storeName)}.fetch({ ${log.yellow('event')}, variables });

			return { props: { variables } };
		}
	</script>

	<script lang="ts">
		import { type ${log.cyan(storeName)}$input } from '$houdini'
		export let variables: ${log.cyan(storeName)}$input;

		$: browser && ${log.cyan(storeName)}.fetch({ variables });
	</script>

	${log.cyan('2/ Client only')}
	<script lang="ts">
		$: browser && ${log.cyan(storeName)}.fetch({ variables: { ... } });
	</script>

	${log.cyan('3/ Endpoint')}
	import fetch from 'node-fetch'
	import { ${log.cyan(storeName)} } from '$houdini';

	export async function get(event) {
		return {
			props: {
				data: await  ${log.cyan(storeName)}.fetch({ event, fetch })
			}
		};
	}

`);
        throw new Error('Error, check above logs for help.');
    }
    let houdiniContext = (params && 'context' in params && params.context) || null;
    houdiniContext !== null && houdiniContext !== void 0 ? houdiniContext : (houdiniContext = nullHoudiniContext());
    // looking at the session will error while prerendering
    let session = null;
    try {
        if (params &&
            'event' in params &&
            params.event &&
            'session' in params.event &&
            params.event.session) {
            session = params.event.session;
        }
        else {
            session = (_a = houdiniContext.session) === null || _a === void 0 ? void 0 : _a.call(houdiniContext);
        }
    }
    catch { }
    // figure out the right policy
    let policy = params === null || params === void 0 ? void 0 : params.policy;
    if (!policy) {
        // use the artifact policy as the default, otherwise prefer the cache over the network
        policy = (_b = artifact.policy) !== null && _b !== void 0 ? _b : CachePolicy.CacheOrNetwork;
    }
    // figure out the right fetch to use
    let fetch = null;
    if (params) {
        if ('fetch' in params && params.fetch) {
            fetch = params.fetch;
        }
        else if ('event' in params && params.event && 'fetch' in params.event) {
            fetch = params.event.fetch;
        }
    }
    if (!fetch) {
        if (isBrowser) {
            fetch = window.fetch.bind(window);
        }
        else {
            throw new Error('Cannot find fetch to use');
        }
    }
    // find the right stuff
    let stuff = ((_c = houdiniContext === null || houdiniContext === void 0 ? void 0 : houdiniContext.stuff) === null || _c === void 0 ? void 0 : _c.call(houdiniContext)) || {};
    if (params && 'event' in params && params.event && 'stuff' in params.event) {
        stuff = params.event.stuff;
    }
    return {
        context: {
            fetch,
            metadata: (_d = params === null || params === void 0 ? void 0 : params.metadata) !== null && _d !== void 0 ? _d : {},
            session,
            stuff,
        },
        policy,
        params: params !== null && params !== void 0 ? params : {},
    };
}
async function fetchAndCache({ config, context, artifact, variables, store, updateStore, cached, ignoreFollowup, setLoadPending, policy, }) {
    const request = await fetchQuery({
        config,
        context,
        artifact,
        variables,
        cached,
        policy,
    });
    const { result, source, partial } = request;
    // we're done
    setLoadPending(false);
    if (result.data && source !== DataSource.Cache) {
        // update the cache with the data that we just ran into
        cache.write({
            selection: artifact.selection,
            data: result.data,
            variables: variables || {},
        });
    }
    if (updateStore) {
        // unmarshal the result into complex scalars if its a response from the server
        const unmarshaled = source === DataSource.Cache
            ? result.data
            : unmarshalSelection(config, artifact.selection, result.data);
        // since we know we're not prefetching, we need to update the store with any errors
        if (result.errors && result.errors.length > 0) {
            store.update((s) => ({
                ...s,
                errors: result.errors,
                isFetching: false,
                partial: false,
                data: unmarshaled,
                source,
                variables,
            }));
            // don't go any further
            throw result.errors;
        }
        else {
            store.set({
                data: (unmarshaled || {}),
                variables: variables || {},
                errors: null,
                isFetching: false,
                partial: request.partial,
                source: request.source,
            });
        }
    }
    if (!ignoreFollowup) {
        // if the data was loaded from a cached value, and the document cache policy wants a
        // network request to be sent after the data was loaded, load the data
        if (source === DataSource.Cache && artifact.policy === CachePolicy.CacheAndNetwork) {
            fetchAndCache({
                config,
                context,
                artifact,
                variables,
                store,
                cached: false,
                updateStore,
                ignoreFollowup: true,
                setLoadPending,
                policy,
            });
        }
        // if we have a partial result and we can load the rest of the data
        // from the network, send the request
        if (partial && artifact.policy === CachePolicy.CacheOrNetwork) {
            fetchAndCache({
                config,
                context,
                artifact,
                variables,
                store,
                cached: false,
                updateStore,
                ignoreFollowup: true,
                setLoadPending,
                policy,
            });
        }
    }
    return request;
}
export const sessionQueryStore = (session, home) => {
    return sessionStore(session, home, () => ({
        data: null,
        errors: null,
        isFetching: false,
        partial: false,
        source: null,
        variables: null,
    }));
};
