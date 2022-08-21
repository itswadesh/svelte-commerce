import { Operation, GraphQLTagResult } from '../lib';
export declare type MutationConfig<_Result, _Input> = {
    optimisticResponse?: _Result;
};
export declare function mutation<_Mutation extends Operation<any, any>>(document: GraphQLTagResult): (variables: _Mutation['input'], mutationConfig?: MutationConfig<_Mutation["result"], _Mutation["input"]> | undefined) => Promise<_Mutation['result']>;
