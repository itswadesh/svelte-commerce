import { GraphQLObject, GraphQLValue, SubscriptionSelection, SubscriptionSpec } from '..';
import { ConfigFile } from '../lib';
import { GarbageCollector } from './gc';
import { ListCollection, ListManager } from './lists';
import { InMemoryStorage, Layer, LayerID } from './storage';
import { InMemorySubscriptions } from './subscription';
export declare class Cache {
    _internal_unstable: CacheInternal;
    constructor(config: ConfigFile);
    write({ layer: layerID, notifySubscribers, ...args }: {
        data: {
            [key: string]: GraphQLValue;
        };
        selection: SubscriptionSelection;
        variables?: {};
        parent?: string;
        layer?: LayerID | null;
        applyUpdates?: boolean;
        notifySubscribers?: SubscriptionSpec[];
        forceNotify?: boolean;
    }): SubscriptionSpec[];
    read(...args: Parameters<CacheInternal['getSelection']>): {
        data: GraphQLObject | null;
        partial: boolean;
    };
    subscribe(spec: SubscriptionSpec, variables?: {}): void;
    unsubscribe(spec: SubscriptionSpec, variables?: {}): void;
    list(name: string, parentID?: string | {}): ListCollection;
    delete(id: string): void;
}
declare class CacheInternal {
    private _disabled;
    config: ConfigFile;
    storage: InMemoryStorage;
    subscriptions: InMemorySubscriptions;
    lists: ListManager;
    cache: Cache;
    lifetimes: GarbageCollector;
    constructor({ config, storage, subscriptions, lists, cache, lifetimes, }: {
        storage: InMemoryStorage;
        config: ConfigFile;
        subscriptions: InMemorySubscriptions;
        lists: ListManager;
        cache: Cache;
        lifetimes: GarbageCollector;
    });
    writeSelection({ data, selection, variables, root, parent, applyUpdates, layer, toNotify, forceNotify, }: {
        data: {
            [key: string]: GraphQLValue;
        };
        selection: SubscriptionSelection;
        variables?: {
            [key: string]: GraphQLValue;
        };
        parent?: string;
        root?: string;
        layer: Layer;
        toNotify?: SubscriptionSpec[];
        applyUpdates?: boolean;
        forceNotify?: boolean;
    }): SubscriptionSpec[];
    getSelection({ selection, parent, variables, stepsFromConnection, }: {
        selection: SubscriptionSelection;
        parent?: string;
        variables?: {};
        stepsFromConnection?: number | null;
    }): {
        data: GraphQLObject | null;
        partial: boolean;
        hasData: boolean;
    };
    id(type: string, data: {} | null): string | null;
    id(type: string, id: string): string | null;
    idFields(type: string): string[];
    computeID(type: string, data: any): string;
    hydrateNestedList({ fields, variables, linkedList, stepsFromConnection, }: {
        fields: SubscriptionSelection;
        variables?: {};
        linkedList: LinkedList;
        stepsFromConnection: number | null;
    }): {
        data: LinkedList<GraphQLValue>;
        partial: boolean;
        hasData: boolean;
    };
    extractNestedListIDs({ value, abstract, recordID, key, linkedType, fields, variables, applyUpdates, specs, layer, forceNotify, }: {
        value: GraphQLValue[];
        recordID: string;
        key: string;
        linkedType: string;
        abstract: boolean;
        variables: {};
        specs: SubscriptionSpec[];
        applyUpdates: boolean;
        fields: SubscriptionSelection;
        layer: Layer;
        forceNotify?: boolean;
    }): {
        nestedIDs: LinkedList;
        newIDs: (string | null)[];
    };
    collectGarbage(): void;
}
export declare const rootID = "_ROOT_";
export declare type LinkedList<_Result = string> = (_Result | null | LinkedList<_Result>)[];
export {};
