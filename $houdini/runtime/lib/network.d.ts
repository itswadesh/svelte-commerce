import { LoadEvent, Page } from '@sveltejs/kit';
import type { ConfigFile } from './config';
import { CachePolicy, DataSource, GraphQLObject, MutationArtifact, QueryArtifact, SubscriptionArtifact } from './types';
export declare class HoudiniClient {
    private fetchFn;
    socket: SubscriptionHandler | null | undefined;
    constructor(networkFn: RequestHandler<any>, subscriptionHandler?: SubscriptionHandler | null);
    sendRequest<_Data>(ctx: FetchContext, params: FetchParams, session?: FetchSession): Promise<RequestPayloadMagic<_Data>>;
    init(): void;
}
export declare class Environment extends HoudiniClient {
    constructor(...args: ConstructorParameters<typeof HoudiniClient>);
}
export declare function setEnvironment(env: HoudiniClient): void;
export declare function getCurrentClient(): HoudiniClient | null;
export declare type SubscriptionHandler = {
    subscribe: (payload: {
        query: string;
        variables?: {};
    }, handlers: {
        next: (payload: {
            data?: {};
            errors?: readonly {
                message: string;
            }[];
        }) => void;
        error: (data: {}) => void;
        complete: () => void;
    }) => () => void;
};
export declare type FetchParams = {
    text: string;
    hash: string;
    variables: {
        [key: string]: any;
    };
};
export declare type FetchContext = {
    fetch: (info: RequestInfo, init?: RequestInit) => Promise<Response>;
    session: App.Session | null;
    stuff: App.Stuff | null;
    metadata?: App.Metadata | null;
};
export declare type BeforeLoadContext = LoadEvent;
export declare type AfterLoadContext = LoadEvent & {
    input: Record<string, any>;
    data: Record<string, any>;
};
export declare type KitLoadResponse = {
    status?: number;
    error?: Error;
    redirect?: string;
    props?: Record<string, any>;
    context?: Record<string, any>;
    maxage?: number;
};
export declare type FetchSession = any;
declare type GraphQLError = {
    message: string;
};
export declare type RequestPayloadMagic<_Data = any> = {
    ssr: boolean;
    body: RequestPayload<_Data>;
};
export declare type RequestPayload<_Data = any> = {
    data: _Data;
    errors: {
        message: string;
    }[];
};
/**
 * ## Tips 👇
 *
 * Create a file `src/app.d.ts` containing the following:
 *
 * ```ts
 * declare namespace App { *
 * 	interface Session {}
 * 	interface Metadata {}
 * }
 * ```
 *
 * Like this, Session and Metadata will be typed everywhere!
 */
export declare type RequestHandlerArgs = Omit<FetchContext & FetchParams, 'stuff'>;
export declare type RequestHandler<_Data> = (args: RequestHandlerArgs, session?: FetchSession) => Promise<RequestPayload<_Data>>;
export declare function executeQuery<_Data extends GraphQLObject, _Input>({ artifact, variables, session, cached, config, metadata, fetch, }: {
    artifact: QueryArtifact | MutationArtifact;
    variables: _Input;
    session: App.Session | null;
    cached: boolean;
    config: ConfigFile;
    metadata?: App.Metadata;
    fetch?: LoadEvent['fetch'];
}): Promise<{
    result: RequestPayload;
    partial: boolean;
}>;
export declare function convertKitPayload(context: RequestContext, loader: (ctx: LoadEvent) => Promise<KitLoadResponse>, page: Page, session: FetchContext['session']): Promise<Record<string, any> | undefined>;
export declare type FetchQueryResult<_Data> = {
    result: RequestPayload<_Data | null>;
    source: DataSource | null;
    partial: boolean;
};
export declare type QueryInputs<_Data> = FetchQueryResult<_Data> & {
    variables: {
        [key: string]: any;
    };
};
export declare function fetchQuery<_Data extends GraphQLObject, _Input>({ config, context, artifact, variables, cached, policy, }: {
    config: ConfigFile;
    context: FetchContext;
    artifact: QueryArtifact | MutationArtifact;
    variables: _Input;
    cached?: boolean;
    policy?: CachePolicy;
}): Promise<FetchQueryResult<_Data>>;
export declare class RequestContext {
    private loadEvent;
    continue: boolean;
    returnValue: {};
    constructor(ctx: LoadEvent);
    error(status: number, message: string | Error): any;
    redirect(status: number, location: string): any;
    fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
    graphqlErrors(payload: {
        errors?: GraphQLError[];
    }): any;
    invokeLoadHook({ variant, framework, hookFn, input, data, }: {
        variant: 'before' | 'after';
        framework: 'kit' | 'sapper';
        hookFn: KitBeforeLoad | KitAfterLoad | SapperBeforeLoad | SapperAfterLoad;
        input: Record<string, any>;
        data: Record<string, any>;
    }): Promise<void>;
    computeInput({ config, framework, variableFunction, artifact, }: {
        framework: 'kit' | 'sapper';
        variableFunction: SapperBeforeLoad | KitBeforeLoad;
        artifact: QueryArtifact | MutationArtifact | SubscriptionArtifact;
        config: ConfigFile;
    }): {} | null | undefined;
}
declare type SapperBeforeLoad = (page: Page, session: LoadEvent['session']) => Record<string, any>;
declare type SapperAfterLoad = (page: Page, session: LoadEvent['session'], data: Record<string, any>, input: Record<string, any>) => Record<string, any>;
declare type KitBeforeLoad = (ctx: BeforeLoadContext) => Record<string, any>;
declare type KitAfterLoad = (ctx: AfterLoadContext) => Record<string, any>;
export {};
