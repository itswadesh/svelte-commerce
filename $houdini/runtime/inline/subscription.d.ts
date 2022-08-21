import { Readable } from 'svelte/store';
import { Operation, GraphQLTagResult } from '../lib/types';
export declare function subscription<_Subscription extends Operation<any, any>>(document: GraphQLTagResult, variables?: _Subscription['input']): {
    data: Readable<_Subscription['result']>;
};
