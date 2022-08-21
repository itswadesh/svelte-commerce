import { Readable } from 'svelte/store';
import { GraphQLTagResult, Operation, QueryResult, CachePolicy } from '../lib/types';
import { PaginatedDocumentHandlers, PageInfo } from '../lib/pagination';
export declare function query<_Query extends Operation<any, any>>(document: GraphQLTagResult): QueryResponse<_Query['result'], _Query['input']>;
export declare type QueryResponse<_Data, _Input> = {
    data: Readable<_Data>;
    refetch: (input?: _Input, config?: RefetchConfig) => Promise<QueryResult<_Data, _Input>>;
    loading: Readable<boolean>;
    partial: Readable<boolean>;
    errors: Readable<{
        message: string;
    }[] | null>;
    variables: Readable<_Input>;
};
declare type RefetchConfig = {
    policy?: CachePolicy;
};
export declare function paginatedQuery<_Query extends Operation<any, any>>(document: GraphQLTagResult): QueryResponse<_Query['result'], _Query['input']> & Omit<PaginatedDocumentHandlers<_Query['result'], _Query['input']>, 'pageInfos'> & {
    pageInfo: Readable<PageInfo>;
};
export {};
