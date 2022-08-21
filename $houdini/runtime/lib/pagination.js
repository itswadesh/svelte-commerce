// externals
import { derived, get, writable } from 'svelte/store';
// locals
import { deepEquals } from '..';
import cache from '../cache';
import { keyFieldsForType } from './config';
import { getHoudiniContext } from './context';
import { executeQuery } from './network';
import { fetchContext, sessionQueryStore } from '../stores/query';
import { currentReqID, sessionStore } from './session';
export function wrapPaginationStore(store) {
    // @ts-ignore
    const { loadNextPage, loadPreviousPage, paginationStrategy, subscribe, ...rest } = store;
    // grab the current houdini context
    const context = getHoudiniContext();
    const result = rest;
    if (loadNextPage) {
        // @ts-ignore
        result.loadNextPage = (...args) => loadNextPage(context, ...args);
    }
    if (loadPreviousPage) {
        // @ts-ignore
        result.loadPreviousPage = (...args) => loadPreviousPage(context, ...args);
    }
    if (paginationStrategy === 'cursor') {
        // @ts-ignore
        result.pageInfo = derived([{ subscribe }], ([$store]) => {
            // @ts-ignore
            return $store.pageInfo;
        });
    }
    return { subscribe, ...result };
}
export function fragmentHandlers({ config, paginationArtifact, stores, storeName, }) {
    var _a, _b;
    const { targetType } = paginationArtifact.refetch || {};
    const typeConfig = (_a = config.types) === null || _a === void 0 ? void 0 : _a[targetType || ''];
    if (!typeConfig) {
        throw new Error(`Missing type refetch configuration for ${targetType}. For more information, see https://www.houdinigraphql.com/guides/pagination#paginated-fragments`);
    }
    let queryVariables = (reqID) => ({});
    // if the query is embedded we have to figure out the correct variables to pass
    if (paginationArtifact.refetch.embedded) {
        // if we have a specific function to use when computing the variables
        if ((_b = typeConfig.resolve) === null || _b === void 0 ? void 0 : _b.arguments) {
            queryVariables = (reqID) => {
                var _a, _b;
                const value = get(stores[reqID]);
                return (((_b = (_a = typeConfig.resolve).arguments) === null || _b === void 0 ? void 0 : _b.call(_a, value)) || {});
            };
        }
        else {
            const keys = keyFieldsForType(config, targetType || '');
            queryVariables = (reqID) => {
                const value = get(stores[reqID]);
                // @ts-ignore
                return Object.fromEntries(keys.map((key) => [key, value[key]]));
            };
        }
    }
    return paginationHandlers({
        storeName,
        config,
        stores,
        artifact: paginationArtifact,
        queryVariables,
        fetch: async () => {
            return {};
        },
        getValue: (reqID) => {
            return get(stores[reqID]);
        },
    });
}
export function queryHandlers({ config, artifact, stores, fetch, queryVariables, storeName, }) {
    // if there's no refetch config for the artifact there's a problem
    if (!artifact.refetch) {
        throw new Error('paginatedQuery must be passed a query with @paginate.');
    }
    // return the handlers
    return paginationHandlers({
        artifact,
        stores,
        queryVariables,
        fetch,
        config,
        storeName,
        getValue: (reqID) => { var _a; return ((_a = get(stores[reqID])) === null || _a === void 0 ? void 0 : _a.data) || {}; },
    });
}
function paginationHandlers({ artifact, stores, queryVariables, fetch, config, storeName, getValue, }) {
    var _a, _b;
    // start with the defaults and no meaningful page info
    let loadPreviousPage = async (...args) => { };
    let loadNextPage = async (...args) => { };
    let pageInfos = {};
    // loading state
    let paginationLoadingState = writable(false);
    let onUnsubscribe = (reqID) => { };
    let fetchQuery;
    let paginationStrategy = (_a = artifact.refetch) === null || _a === void 0 ? void 0 : _a.method;
    // if the artifact supports cursor based pagination
    if (((_b = artifact.refetch) === null || _b === void 0 ? void 0 : _b.method) === 'cursor') {
        // generate the cursor handlers
        const cursor = cursorHandlers({
            artifact,
            stores,
            queryVariables,
            loading: paginationLoadingState,
            fetch,
            config,
            storeName,
            getValue,
        });
        // always track pageInfo
        pageInfos = cursor.pageInfos;
        // always use the refetch fn
        fetchQuery = cursor.fetch;
        onUnsubscribe = cursor.onUnsubscribe;
        // if we are implementing forward pagination
        if (artifact.refetch.update === 'append') {
            loadNextPage = cursor.loadNextPage;
        }
        // the artifact implements backwards pagination
        else {
            loadPreviousPage = cursor.loadPreviousPage;
        }
    }
    // the artifact supports offset-based pagination, only loadNextPage is valid
    else {
        const offset = offsetPaginationHandler({
            artifact,
            queryVariables,
            fetch,
            stores,
            config,
            storeName,
            loading: paginationLoadingState,
            getValue,
        });
        loadNextPage = offset.loadPage;
        fetchQuery = offset.fetch;
    }
    // merge the pagination and document loading state
    const loading = derived([paginationLoadingState], ($loadingStates) => $loadingStates[0]);
    return {
        loadNextPage,
        loadPreviousPage,
        pageInfos,
        loading,
        fetch: fetchQuery,
        onUnsubscribe,
        paginationStrategy,
    };
}
function cursorHandlers({ config, artifact, stores, queryVariables: extraVariables, loading, fetch, storeName, getValue, }) {
    const pageInfos = {};
    // dry up the page-loading logic
    const loadPage = async ({ houdiniContext, pageSizeVar, input, functionName, }) => {
        var _a, _b, _c;
        // figure out the reqID for this session
        const reqID = currentReqID(houdiniContext, stores);
        // get the pageInfo store
        const pageInfo = pageInfoStore(houdiniContext, pageInfos);
        // set the loading state to true
        loading.set(true);
        // build up the variables to pass to the query
        const loadVariables = {
            ...extraVariables === null || extraVariables === void 0 ? void 0 : extraVariables(reqID),
            ...houdiniContext.variables(),
            ...input,
        };
        // if we don't have a value for the page size, tell the user
        if (!loadVariables[pageSizeVar] && !artifact.refetch.pageSize) {
            throw missingPageSizeError(functionName);
        }
        // send the query
        const { result } = await executeQuery({
            artifact,
            variables: loadVariables,
            session: (_a = houdiniContext.session) === null || _a === void 0 ? void 0 : _a.call(houdiniContext),
            cached: false,
            config,
        });
        // if the query is embedded in a node field (paginated fragments)
        // make sure we look down one more for the updated page info
        const resultPath = [...artifact.refetch.path];
        if (artifact.refetch.embedded) {
            const { targetType } = artifact.refetch;
            // make sure we have a type config for the pagination target type
            if (!((_c = (_b = config.types) === null || _b === void 0 ? void 0 : _b[targetType]) === null || _c === void 0 ? void 0 : _c.resolve)) {
                throw new Error(`Missing type resolve configuration for ${targetType}. For more information, see https://www.houdinigraphql.com/guides/pagination#paginated-fragments`);
            }
            // make sure that we pull the value out of the correct query field
            resultPath.unshift(config.types[targetType].resolve.queryField);
        }
        // we need to find the connection object holding the current page info
        pageInfo.set(extractPageInfo(result.data, resultPath));
        // update cache with the result
        cache.write({
            selection: artifact.selection,
            data: result.data,
            variables: loadVariables,
            applyUpdates: true,
        });
        // we're not loading any more
        loading.set(false);
    };
    return {
        loading,
        loadNextPage: async (houdiniContext, pageCount) => {
            // figure out the reqID for this session
            const reqID = currentReqID(houdiniContext, stores);
            // we need to find the connection object holding the current page info
            const currentPageInfo = extractPageInfo(getValue(reqID), artifact.refetch.path);
            // if there is no next page, we're done
            if (!currentPageInfo.hasNextPage) {
                return;
            }
            // only specify the page count if we're given one
            const input = {
                after: currentPageInfo.endCursor,
            };
            if (pageCount) {
                input.first = pageCount;
            }
            // load the page
            return await loadPage({
                houdiniContext,
                pageSizeVar: 'first',
                functionName: 'loadNextPage',
                input,
            });
        },
        loadPreviousPage: async (houdiniContext, pageCount) => {
            // figure out the reqID for this session
            const reqID = currentReqID(houdiniContext, stores);
            // we need to find the connection object holding the current page info
            const currentPageInfo = extractPageInfo(getValue(reqID), artifact.refetch.path);
            // if there is no next page, we're done
            if (!currentPageInfo.hasPreviousPage) {
                return;
            }
            // only specify the page count if we're given one
            const input = {
                before: currentPageInfo.startCursor,
            };
            if (pageCount) {
                input.last = pageCount;
            }
            // load the page
            return await loadPage({
                houdiniContext,
                pageSizeVar: 'last',
                functionName: 'loadPreviousPage',
                input,
            });
        },
        pageInfos,
        async fetch(args) {
            // validate and prepare the request context for the current environment (client vs server)
            const { context, params } = fetchContext(artifact, storeName, args);
            // get the session stores we will write to
            const reqID = currentReqID(context.session, stores);
            const pageInfo = sessionStore(context.session, pageInfos, nullPageInfo);
            const data = sessionQueryStore(context.session, stores);
            const { variables } = params !== null && params !== void 0 ? params : {};
            // build up the variables to pass to the query
            const queryVariables = {
                ...extraVariables(reqID),
                ...variables,
            };
            // if the input is different than the query variables then we just do everything like normal
            if (variables && !deepEquals(extraVariables(reqID), variables)) {
                const result = await fetch(params);
                pageInfo.set(extractPageInfo(result, artifact.refetch.path));
            }
            // we are updating the current set of items, count the number of items that currently exist
            // and ask for the full data set
            const count = countPage(artifact.refetch.path.concat('edges'), get(data).data) ||
                artifact.refetch.pageSize;
            // if there are more records than the first page, we need fetch to load everything
            if (count && count > artifact.refetch.pageSize) {
                // reverse cursors need the last entries in the list
                queryVariables[artifact.refetch.update === 'prepend' ? 'last' : 'first'] = count;
            }
            // set the loading state to true
            loading.set(true);
            // send the query
            const result = await fetch({
                ...params,
                variables: queryVariables,
            });
            // keep the page info store up to date
            pageInfo.set(extractPageInfo(result.data, artifact.refetch.path));
            // we're not loading any more
            loading.set(false);
            return {
                data: result.data,
                variables: queryVariables,
                isFetching: false,
                partial: result.partial,
                errors: null,
                source: result.source,
            };
        },
        onUnsubscribe(reqID) {
            if (pageInfos[reqID]) {
                delete pageInfos[reqID];
            }
        },
    };
}
function offsetPaginationHandler({ artifact, queryVariables: extraVariables, fetch, stores, getValue, config, loading, storeName, }) {
    // we need to track the most recent offset for this handler
    let currentOffset = (ctx) => {
        var _a, _b;
        const store = sessionQueryStore(ctx, stores);
        return (((_a = artifact.refetch) === null || _a === void 0 ? void 0 : _a.start) ||
            countPage(artifact.refetch.path, (_b = get(store)) === null || _b === void 0 ? void 0 : _b.data) ||
            artifact.refetch.pageSize);
    };
    return {
        loadPage: async (houdiniContext, limit) => {
            var _a;
            const offset = currentOffset(houdiniContext);
            // figure out the reqID for this session
            const reqID = currentReqID(houdiniContext, stores);
            // build up the variables to pass to the query
            const queryVariables = {
                ...houdiniContext.variables(),
                ...extraVariables(reqID),
                offset,
            };
            if (limit) {
                queryVariables.limit = limit;
            }
            // if we made it this far without a limit argument and there's no default page size,
            // they made a mistake
            if (!queryVariables.limit && !artifact.refetch.pageSize) {
                throw missingPageSizeError('loadNextPage');
            }
            // set the loading state to true
            loading.set(true);
            // send the query
            const { result } = await executeQuery({
                artifact,
                variables: queryVariables,
                session: (_a = houdiniContext.session) === null || _a === void 0 ? void 0 : _a.call(houdiniContext),
                cached: false,
                config,
            });
            // update cache with the result
            cache.write({
                selection: artifact.selection,
                data: result.data,
                variables: queryVariables,
                applyUpdates: true,
            });
            // add the page size to the offset so we load the next page next time
            const pageSize = queryVariables.limit || artifact.refetch.pageSize;
            currentOffset += pageSize;
            // we're not loading any more
            loading.set(false);
        },
        async fetch(args) {
            const { params, context } = fetchContext(artifact, storeName, args);
            const reqID = currentReqID(context.session, stores);
            // make sure we created a query store
            sessionQueryStore(context.session, stores);
            const { variables } = params !== null && params !== void 0 ? params : {};
            // if the input is different than the query variables then we just do everything like normal
            if (variables && !deepEquals(extraVariables(reqID), variables)) {
                return fetch(params);
            }
            // we are updating the current set of items, count the number of items that currently exist
            // and ask for the full data set
            const count = countPage(artifact.refetch.path, getValue(reqID)) || artifact.refetch.pageSize;
            // build up the variables to pass to the query
            const queryVariables = {
                ...extraVariables(reqID),
            };
            // if there are more records than the first page, we need fetch to load everything
            if (count > artifact.refetch.pageSize) {
                queryVariables.limit = count;
            }
            // set the loading state to true
            loading.set(true);
            // send the query
            const result = await fetch({
                ...params,
                variables: queryVariables,
            });
            // we're not loading any more
            loading.set(false);
            return {
                data: result.data,
                variables: queryVariables,
                isFetching: false,
                partial: result.partial,
                errors: null,
                source: result.source,
            };
        },
    };
}
function missingPageSizeError(fnName) {
    return;
}
export function extractPageInfo(data, path) {
    var _a;
    if (!data) {
        return {
            startCursor: null,
            endCursor: null,
            hasNextPage: false,
            hasPreviousPage: false,
        };
    }
    let localPath = [...path];
    // walk down the object until we get to the end
    let current = data;
    while (localPath.length > 0) {
        if (!current) {
            break;
        }
        current = current[localPath.shift()];
    }
    return (_a = current === null || current === void 0 ? void 0 : current.pageInfo) !== null && _a !== void 0 ? _a : nullPageInfo();
}
export function countPage(source, value) {
    let data = value;
    if (value === null || data === null || data === undefined) {
        return 0;
    }
    for (const field of source) {
        const obj = data[field];
        if (obj && !Array.isArray(obj)) {
            data = obj;
        }
        else if (!data) {
            throw new Error('Could not count page size');
        }
        if (Array.isArray(obj)) {
            return obj.length;
        }
    }
    return 0;
}
const nullPageInfo = () => ({
    startCursor: null,
    endCursor: null,
    hasNextPage: false,
    hasPreviousPage: false,
});
export const pageInfoStore = (session, home) => {
    return sessionStore(session, home, nullPageInfo);
};
