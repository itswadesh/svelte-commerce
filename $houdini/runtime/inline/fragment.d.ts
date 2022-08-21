import { Readable } from 'svelte/store';
import type { Fragment, GraphQLTagResult } from '../lib/types';
import { PaginatedDocumentHandlers, PageInfo } from '../lib/pagination';
export declare function fragment<_Fragment extends Fragment<any>>(fragment: GraphQLTagResult, ref: _Fragment): Readable<NonNullable<_Fragment['shape']>> & {
    data: Readable<_Fragment>;
};
export declare function fragment<_Fragment extends Fragment<any>>(fragment: GraphQLTagResult, ref: _Fragment | null): Readable<NonNullable<_Fragment['shape']> | null> & {
    data: Readable<_Fragment | null>;
};
export declare function paginatedFragment<_Fragment extends Fragment<any>>(document: GraphQLTagResult, initialValue: _Fragment | null): {
    data: Readable<_Fragment['shape'] | null>;
} & Omit<PaginatedDocumentHandlers<_Fragment['shape'], {}>, 'refetch'>;
export declare function paginatedFragment<_Fragment extends Fragment<any>>(document: GraphQLTagResult, initialValue: _Fragment): {
    data: Readable<_Fragment['shape']>;
} & Omit<Omit<PaginatedDocumentHandlers<_Fragment['shape'], {}>, 'pageInfo' & {
    pageInfo: Readable<PageInfo>;
}>, 'refetch'>;
