// externals
import { derived } from 'svelte/store';
// locals
import { CachePolicy } from '../lib/types';
import { wrapPaginationStore } from '../lib/pagination';
import { getHoudiniContext } from '../lib/context';
export function query(document) {
    // make sure we got a query document
    if (document.kind !== 'HoudiniQuery') {
        throw new Error('query() must be passed a query document');
    }
    // build some derived stores for the atomic values
    const data = derived(document.store, ($store) => $store.data);
    const loading = derived(document.store, ($store) => $store.isFetching);
    const partial = derived(document.store, ($store) => $store.partial);
    const errors = derived(document.store, ($store) => $store.errors);
    const variables = derived(document.store, ($store) => $store.variables);
    // load the current houdini context
    const context = getHoudiniContext();
    return {
        ...document.store,
        data,
        refetch: (variables, config) => {
            return document.store.fetch({
                context,
                variables,
                policy: CachePolicy.NetworkOnly,
                ...config,
            });
        },
        errors,
        loading,
        partial,
        variables,
    };
}
export function paginatedQuery(document) {
    // TODO: fix type checking paginated
    // @ts-ignore: the query store will only include the methods when it needs to
    // and the userland type checking happens as part of the query type generation
    return wrapPaginationStore(query(document));
}
