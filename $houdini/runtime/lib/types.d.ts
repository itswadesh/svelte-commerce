import type { LoadEvent, RequestEvent } from '@sveltejs/kit';
import { Readable } from 'svelte/store';
import { MutationConfig } from '../inline/mutation';
import type { ConfigFile } from './config';
import { HoudiniDocumentProxy } from './proxy';
export type { ConfigFile } from './config';
export declare enum CachePolicy {
    CacheOrNetwork = "CacheOrNetwork",
    CacheOnly = "CacheOnly",
    NetworkOnly = "NetworkOnly",
    CacheAndNetwork = "CacheAndNetwork"
}
export declare type Fragment<_Result> = {
    readonly shape?: _Result;
};
export declare type Operation<_Result, _Input> = {
    readonly result: _Result;
    readonly input: _Input;
};
export declare type Session = any;
export declare type Maybe<T> = T | null | undefined;
export declare type DocumentArtifact = FragmentArtifact | QueryArtifact | MutationArtifact | SubscriptionArtifact;
export declare enum ArtifactKind {
    Query = "HoudiniQuery",
    Subcription = "HoudiniSubscription",
    Mutation = "HoudiniMutation",
    Fragment = "HoudiniFragment"
}
export declare type QueryArtifact = BaseCompiledDocument & {
    kind: ArtifactKind.Query;
    policy?: CachePolicy;
    partial?: boolean;
};
export declare type MutationArtifact = BaseCompiledDocument & {
    kind: ArtifactKind.Mutation;
};
export declare type FragmentArtifact = BaseCompiledDocument & {
    kind: ArtifactKind.Fragment;
};
export declare type SubscriptionArtifact = BaseCompiledDocument & {
    kind: ArtifactKind.Subcription;
};
export declare enum RefetchUpdateMode {
    append = "append",
    prepend = "prepend",
    replace = "replace"
}
export declare type InputObject = {
    fields: Record<string, string>;
    types: Record<string, Record<string, string>>;
};
export declare type BaseCompiledDocument = {
    name: string;
    raw: string;
    hash: string;
    selection: SubscriptionSelection;
    rootType: string;
    input?: InputObject;
    refetch?: {
        update: RefetchUpdateMode;
        path: string[];
        method: 'cursor' | 'offset';
        pageSize: number;
        start?: string | number;
        embedded: boolean;
        targetType: string;
        paginated: boolean;
        direction?: 'forward' | 'backwards';
    };
};
export declare type GraphQLTagResult = TaggedGraphqlQuery | TaggedGraphqlFragment | TaggedGraphqlMutation | TaggedGraphqlSubscription;
export declare type TaggedGraphqlFragment = {
    kind: 'HoudiniFragment';
    artifact: FragmentArtifact;
    store: FragmentStore<any>;
    proxy: HoudiniDocumentProxy;
};
export declare type QueryResult<_Data, _Input> = {
    data: _Data | null;
    errors: {
        message: string;
    }[] | null;
    isFetching: boolean;
    partial: boolean;
    source: DataSource | null;
    variables: _Input | null;
};
export declare type MutationResult<_Data, _Input> = {
    data: _Data | null;
    errors: {
        message: string;
    }[] | null;
    isFetching: boolean;
    isOptimisticResponse: boolean;
    variables: _Input | null;
};
declare type FetchGlobalParams<_Input> = {
    variables?: _Input;
    /**
     * The policy to use when performing the fetch. If set to CachePolicy.NetworkOnly,
     * a request will always be sent, even if the variables are the same as the last call
     * to fetch.
     */
    policy?: CachePolicy;
    /**
     * An object that will be passed to the fetch function.
     * You can do what you want with it!
     */
    metadata?: App.Metadata;
    /**
     * Set to true if you want the promise to pause while it's resolving.
     * Only enable this if you know what you are doing. This will cause route
     * transitions to pause while loading data.
     */
    blocking?: boolean;
};
declare type LoadEventFetchParams<_Input> = FetchGlobalParams<_Input> & {
    /**
     * Directly the `even` param coming from the `load` function
     */
    event?: LoadEvent;
};
declare type RequestEventFetchParams<_Input> = FetchGlobalParams<_Input> & {
    /**
     * A RequestEvent should be provided when the store is being used in an endpoint.
     * When this happens, fetch also needs to be provided
     */
    event?: RequestEvent;
    /**
     * The fetch function to use when using this store in an endpoint.
     */
    fetch?: LoadEvent['fetch'];
};
declare type ClientFetchParams<_Input> = FetchGlobalParams<_Input> & {
    /**
     * An object containing all of the current info necessary for a
     * client-side fetch. Must be called in component initialization with
     * something like this: `const context = getHoudiniFetchContext()`
     */
    context?: HoudiniFetchContext;
};
export declare type QueryStoreFetchParams<_Input> = LoadEventFetchParams<_Input> | RequestEventFetchParams<_Input> | ClientFetchParams<_Input>;
export declare type HoudiniFetchContext = {
    url: () => URL | null;
    session: () => App.Session | null;
    variables: () => {};
    stuff: () => App.Stuff;
};
export declare type SubscriptionStore<_Shape, _Input> = Readable<_Shape> & {
    name: string;
    listen: (input: _Input) => void;
    unlisten: () => void;
};
export declare type FragmentStore<_Shape> = {
    name: string;
    get<T extends Fragment<_Shape>>(value: T): Readable<_Shape> & {
        update: (parent: _Shape | null) => void;
    };
    get<T extends Fragment<_Shape>>(value: T | null): Readable<_Shape | null> & {
        update: (parent: _Shape | null) => void;
    };
};
export declare type QueryStore<_Data, _Input, _Extra = {}> = Readable<QueryResult<_Data, _Input> & _Extra> & {
    name: string;
    /**
     * Fetch the data from the server
     */
    fetch(params?: RequestEventFetchParams<_Input>): Promise<QueryResult<_Data, _Input> & _Extra>;
    fetch(params?: LoadEventFetchParams<_Input>): Promise<QueryResult<_Data, _Input> & _Extra>;
    fetch(params?: ClientFetchParams<_Input>): Promise<QueryResult<_Data, _Input> & _Extra>;
    fetch(params?: QueryStoreFetchParams<_Input>): Promise<QueryResult<_Data, _Input> & _Extra>;
};
export declare type TaggedGraphqlMutation = {
    kind: 'HoudiniMutation';
    store: MutationStore<any, any>;
};
export declare type MutationStore<_Result, _Input> = Readable<MutationResult<_Result, _Input>> & {
    name: string;
    mutate: (params: {
        variables: _Input;
        metadata?: App.Metadata;
        context?: HoudiniFetchContext;
        fetch?: LoadEvent['fetch'];
    } & MutationConfig<_Result, _Input>) => Promise<MutationResult<_Result, _Input>>;
};
export declare type TaggedGraphqlSubscription = {
    kind: 'HoudiniSubscription';
    store: SubscriptionStore<any, any>;
    config: ConfigFile;
};
export declare type TaggedGraphqlQuery = {
    kind: 'HoudiniQuery';
    component: boolean;
    store: QueryStore<any, any>;
    config: ConfigFile;
    artifact: QueryArtifact;
};
declare type Filter = {
    [key: string]: string | boolean | number;
};
export declare type ListWhen = {
    must?: Filter;
    must_not?: Filter;
};
export declare enum DataSource {
    /**
     * from the browser cache
     */
    Cache = "cache",
    /**
     * from a browser side `fetch`
     */
    Network = "network",
    /**
     * from a server side `fetch`
     */
    Ssr = "ssr"
}
export declare type MutationOperation = {
    action: 'insert' | 'remove' | 'delete' | 'toggle';
    list?: string;
    type?: string;
    parentID?: {
        kind: string;
        value: string;
    };
    position?: 'first' | 'last';
    when?: ListWhen;
};
export declare const CompiledFragmentKind = "HoudiniFragment";
export declare const CompiledMutationKind = "HoudiniMutation";
export declare const CompiledQueryKind = "HoudiniQuery";
export declare const CompiledSubscriptionKind = "HoudiniSubscription";
export declare type CompiledDocumentKind = 'HoudiniFragment' | 'HoudiniMutation' | 'HoudiniQuery' | 'HoudiniSubscription';
export declare type GraphQLObject = {
    [key: string]: GraphQLValue;
};
export declare type GraphQLValue = number | string | boolean | null | GraphQLObject | GraphQLValue[] | undefined;
export declare type SubscriptionSelection = {
    [field: string]: {
        type: string;
        nullable?: boolean;
        keyRaw: string;
        operations?: MutationOperation[];
        list?: {
            name: string;
            connection: boolean;
            type: string;
        };
        update?: RefetchUpdateMode;
        filters?: {
            [key: string]: {
                kind: 'Boolean' | 'String' | 'Float' | 'Int' | 'Variable';
                value: string | number | boolean;
            };
        };
        fields?: SubscriptionSelection;
        abstract?: boolean;
    };
};
export declare type SubscriptionSpec = {
    rootType: string;
    selection: SubscriptionSelection;
    set: (data: any) => void;
    parentID?: string;
    variables?: () => any;
};
