import { Readable, Writable } from 'svelte/store';
import { FragmentStore, QueryResult, QueryStore, QueryStoreFetchParams } from '..';
import { ConfigFile } from './config';
import { GraphQLObject, HoudiniFetchContext, QueryArtifact } from './types';
import { QueryResultMap } from '../stores/query';
declare type FetchFn<_Data = any, _Input = any> = (params?: QueryStoreFetchParams<_Input>) => Promise<QueryResult<_Data, _Input>>;
export declare function wrapPaginationStore<_Data, _Input>(store: QueryStore<_Data, _Input> | ReturnType<FragmentStore<_Data>['get']>): {
    name: string;
    fetch(params?: ({
        variables?: _Input | undefined;
        policy?: import("./types").CachePolicy | undefined;
        metadata?: any;
        blocking?: boolean | undefined;
    } & {
        event?: import("@sveltejs/kit").RequestEvent<Record<string, string>> | undefined;
        fetch?: ((info: RequestInfo, init?: RequestInit | undefined) => Promise<Response>) | undefined;
    }) | undefined): Promise<QueryResult<_Data, _Input>>;
    fetch(params?: ({
        variables?: _Input | undefined;
        policy?: import("./types").CachePolicy | undefined;
        metadata?: any;
        blocking?: boolean | undefined;
    } & {
        event?: import("@sveltejs/kit").LoadEvent<Record<string, string>, Record<string, any>> | undefined;
    }) | undefined): Promise<QueryResult<_Data, _Input>>;
    fetch(params?: ({
        variables?: _Input | undefined;
        policy?: import("./types").CachePolicy | undefined;
        metadata?: any;
        blocking?: boolean | undefined;
    } & {
        context?: HoudiniFetchContext | undefined;
    }) | undefined): Promise<QueryResult<_Data, _Input>>;
    fetch(params?: QueryStoreFetchParams<_Input> | undefined): Promise<QueryResult<_Data, _Input>>;
    subscribe: ((this: void, run: import("svelte/store").Subscriber<QueryResult<_Data, _Input>>, invalidate?: ((value?: QueryResult<_Data, _Input> | undefined) => void) | undefined) => import("svelte/store").Unsubscriber) | ((this: void, run: import("svelte/store").Subscriber<_Data | null>, invalidate?: ((value?: _Data | null | undefined) => void) | undefined) => import("svelte/store").Unsubscriber);
} | {
    update: (parent: _Data | null) => void;
    subscribe: ((this: void, run: import("svelte/store").Subscriber<QueryResult<_Data, _Input>>, invalidate?: ((value?: QueryResult<_Data, _Input> | undefined) => void) | undefined) => import("svelte/store").Unsubscriber) | ((this: void, run: import("svelte/store").Subscriber<_Data | null>, invalidate?: ((value?: _Data | null | undefined) => void) | undefined) => import("svelte/store").Unsubscriber);
};
export declare function fragmentHandlers<_Data extends GraphQLObject, _Input>({ config, paginationArtifact, stores, storeName, }: {
    storeName: string;
    config: ConfigFile;
    paginationArtifact: QueryArtifact;
    stores: {
        [reqID: string]: Readable<GraphQLObject | null>;
    };
}): PaginatedHandlers<_Data, _Input>;
export declare function queryHandlers<_Data extends GraphQLObject, _Input>({ config, artifact, stores, fetch, queryVariables, storeName, }: {
    config: ConfigFile;
    artifact: QueryArtifact;
    stores: QueryResultMap<_Data, _Input>;
    fetch: QueryStore<_Data, _Input>['fetch'];
    queryVariables: (reqID: string) => _Input | null;
    pageInfo?: Readable<PageInfo>;
    storeName: string;
}): PaginatedHandlers<_Data, _Input>;
export declare type PaginatedDocumentHandlers<_Data, _Input> = {
    loadNextPage(pageCount?: number, after?: string | number): Promise<void>;
    loadPreviousPage(pageCount?: number, before?: string): Promise<void>;
    loading: Readable<boolean>;
    pageInfo: Readable<PageInfo>;
    refetch: (vars?: _Input) => Promise<_Data>;
};
export declare type PaginatedHandlers<_Data, _Input> = {
    loadNextPage(houdiniContext: HoudiniFetchContext, pageCount?: number, after?: string | number): Promise<void>;
    loadPreviousPage(houdiniContext: HoudiniFetchContext, pageCount?: number, before?: string): Promise<void>;
    loading: Readable<boolean>;
    pageInfos: {
        [reqID: string]: Writable<PageInfo>;
    };
    fetch: FetchFn<_Data, _Input>;
    onUnsubscribe: (reqID: string) => void;
    paginationStrategy?: 'cursor' | 'offset';
};
export declare type PageInfo = {
    startCursor: string | null;
    endCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};
export declare function extractPageInfo(data: GraphQLObject | null, path: string[]): PageInfo;
export declare function countPage<_Data extends GraphQLObject>(source: string[], value: _Data | null): number;
export declare const pageInfoStore: (session: App.Session | {
    session: () => App.Session | null;
} | null, home: {
    [key: string]: Writable<PageInfo>;
}) => Writable<PageInfo>;
export {};
