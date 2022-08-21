import { Writable } from 'svelte/store';
import { CachePolicy, GraphQLObject, QueryStore } from '..';
import { FetchContext, QueryResult, QueryStoreFetchParams } from '../lib';
import type { ConfigFile, QueryArtifact } from '../lib';
import { PageInfo, PaginatedHandlers } from '../lib/pagination';
export declare type QueryResultMap<_Data, _Input> = {
    [reqID: string]: Writable<QueryResult<_Data, _Input> & {
        pageInfo?: PageInfo;
    }>;
};
export declare function queryStore<_Data extends GraphQLObject, _Input>({ config, artifact, storeName, paginationMethods, paginated, }: {
    config: ConfigFile;
    artifact: QueryArtifact;
    paginated: boolean;
    storeName: string;
    paginationMethods: (keyof PaginatedHandlers<_Data, _Input>)[];
}): QueryStore<_Data, _Input>;
export declare function fetchContext<_Data, _Input>(artifact: QueryArtifact, storeName: string, params?: QueryStoreFetchParams<_Input>): {
    context: FetchContext;
    policy: CachePolicy;
    params: QueryStoreFetchParams<_Input>;
};
export declare const sessionQueryStore: <_Data, _Input>(session: App.Session | {
    session: () => App.Session | null;
} | null, home: {
    [key: string]: Writable<QueryResult<_Data, _Input>>;
}) => Writable<QueryResult<_Data, _Input> & {
    pageInfo?: PageInfo | undefined;
}>;
