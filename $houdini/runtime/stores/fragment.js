// externals
import { derived, get, readable } from 'svelte/store';
import { extractPageInfo, fragmentHandlers, pageInfoStore, } from '../lib/pagination';
import { currentReqID, sessionStore } from '../lib/session';
import { getSession, isBrowser } from '../adapter';
// a fragment store exists in multiple places in a given application so we
// can't just return a store directly, the user has to load the version of the
// fragment store for the object the store has been mixed into
export function fragmentStore({ artifact, config, paginatedArtifact, paginationMethods, storeName, }) {
    return {
        name: artifact.name,
        get(initialValue) {
            const stores = {};
            // at the moment a fragment store doesn't really do anything
            // but we're going to keep it wrapped in a store so we can eventually
            // optimize the updates
            let store;
            // build up the methods we want to use
            let extraMethods = {};
            let onUnsubscribe = (reqID) => { };
            let pageInfos = {};
            if (paginatedArtifact) {
                const handlers = fragmentHandlers({
                    storeName,
                    config,
                    paginationArtifact: paginatedArtifact,
                    stores,
                });
                extraMethods = Object.fromEntries(paginationMethods.map((key) => [key, handlers[key]]));
                extraMethods.paginationStrategy = handlers.paginationStrategy;
                onUnsubscribe = handlers.onUnsubscribe;
                pageInfos = handlers.pageInfos;
            }
            // we need to track the first time we write to a fragment store so we
            // can make sure it has data (filled from the initial value argument)
            const written = new Set();
            return {
                subscribe: (...args) => {
                    const session = get(getSession());
                    // grab the appropriate store for the session
                    const requestStore = sessionStore(session, stores, () => initialValue);
                    const reqID = currentReqID(session, stores);
                    // if we haven't written anything yet
                    if (!written.has(reqID)) {
                        written.add(reqID);
                        // update the fragment value
                        requestStore.set(initialValue);
                        // if we have to set up a paginated fragment
                        if (paginatedArtifact) {
                            // update the page info
                            pageInfoStore(session, pageInfos).set(extractPageInfo(initialValue, paginatedArtifact.refetch.path));
                        }
                    }
                    // hold onto the store reference so client's can update
                    if (isBrowser) {
                        store = requestStore;
                    }
                    // we need to add the page info
                    const combined = derived([requestStore, pageInfos[reqID] || readable(null)], ([$store, $pageInfo]) => {
                        if ($store === null) {
                            return null;
                        }
                        // combine the state and page info values
                        const everything = { ...$store };
                        if ($pageInfo) {
                            everything.pageInfo = $pageInfo;
                        }
                        return everything;
                    });
                    const unsub = combined.subscribe(...args);
                    return () => {
                        unsub();
                        onUnsubscribe(reqID);
                        written.delete(reqID);
                    };
                },
                update: (val) => store === null || store === void 0 ? void 0 : store.set(val),
                ...extraMethods,
            };
        },
    };
}
