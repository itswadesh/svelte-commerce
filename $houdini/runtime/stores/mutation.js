// externals
import { get } from 'svelte/store';
// locals
import { executeQuery, } from '../lib';
import cache from '../cache';
import { marshalInputs, marshalSelection, unmarshalSelection } from '../lib/scalars';
import { getSession } from '../adapter';
import { sessionStore } from '../lib/session';
export function mutationStore({ config, artifact, }) {
    const stores = {};
    const mutate = async ({ variables, context, metadata, fetch, ...mutationConfig }) => {
        var _a, _b;
        let fetchContext = context || {
            session: () => null,
        };
        const store = sessionStore(fetchContext, stores, nullMutationStore);
        store.update((c) => {
            return { ...c, isFetching: true };
        });
        // treat a mutation like it has an optimistic layer regardless of
        // whether there actually _is_ one. This ensures that a query which fires
        // after this mutation has been sent will overwrite any return values from the mutation
        //
        // as far as I can tell, this is an arbitrary decision but it does give a
        // well-defined ordering to a subtle situation so that seems like a win
        //
        const layer = cache._internal_unstable.storage.createLayer(true);
        // if there is an optimistic response then we need to write the value immediately
        const optimisticResponse = mutationConfig === null || mutationConfig === void 0 ? void 0 : mutationConfig.optimisticResponse;
        // hold onto the list of subscribers that we updated because of the optimistic response
        // and make sure they are included in the final set of subscribers to notify
        let toNotify = [];
        if (optimisticResponse) {
            toNotify = cache.write({
                selection: artifact.selection,
                // make sure that any scalar values get processed into something we can cache
                data: marshalSelection({
                    config,
                    selection: artifact.selection,
                    data: optimisticResponse,
                }),
                variables,
                layer: layer.id,
            });
            const storeData = {
                data: optimisticResponse,
                errors: null,
                isFetching: true,
                isOptimisticResponse: true,
                variables,
            };
            // update the store value
            store.set(storeData);
        }
        const newVariables = marshalInputs({
            input: variables,
            artifact,
            config,
        });
        try {
            // trigger the mutation
            const { result } = await executeQuery({
                config,
                artifact,
                variables: newVariables,
                session: (_a = fetchContext.session) === null || _a === void 0 ? void 0 : _a.call(fetchContext),
                cached: false,
                metadata,
                fetch,
            });
            if (result.errors && result.errors.length > 0) {
                store.update((s) => ({
                    ...s,
                    errors: result.errors,
                    isFetching: false,
                    isOptimisticResponse: false,
                    data: result.data,
                    variables: (newVariables || {}),
                }));
                throw result.errors;
            }
            // clear the layer holding any mutation results
            layer.clear();
            // write the result of the mutation to the cache
            cache.write({
                selection: artifact.selection,
                data: result.data,
                variables: newVariables,
                // write to the mutation's layer
                layer: layer.id,
                // notify any subscribers that we updated with the optimistic response
                // in order to address situations where the optimistic update was wrong
                notifySubscribers: toNotify,
                // make sure that we notify subscribers for any values that we overwrite
                // in order to address any race conditions when comparing the previous value
                forceNotify: true,
            });
            // merge the layer back into the cache
            cache._internal_unstable.storage.resolveLayer(layer.id);
            // prepare store data
            const storeData = {
                data: unmarshalSelection(config, artifact.selection, result.data),
                errors: (_b = result.errors) !== null && _b !== void 0 ? _b : null,
                isFetching: false,
                isOptimisticResponse: false,
                variables: newVariables,
            };
            // update the store value
            store.set(storeData);
            // return the value to the caller
            return storeData;
        }
        catch (error) {
            store.update((s) => ({
                ...s,
                errors: error,
                isFetching: false,
                isOptimisticResponse: false,
                data: null,
                variables: newVariables,
            }));
            // if the mutation failed, roll the layer back and delete it
            layer.clear();
            cache._internal_unstable.storage.resolveLayer(layer.id);
            // bubble the mutation error up to the caller
            throw error;
        }
    };
    return {
        name: artifact.name,
        subscribe(...args) {
            // grab the appropriate store for the session
            const requestStore = sessionStore(get(getSession()), stores, nullMutationStore);
            // use it's value
            return requestStore.subscribe(...args);
        },
        mutate,
    };
}
const nullMutationStore = () => ({
    data: null,
    errors: null,
    isFetching: false,
    isOptimisticResponse: false,
    variables: null,
});
