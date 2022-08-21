import type { SubscriptionSpec, SubscriptionSelection, GraphQLObject } from '../lib/types';
import { Cache } from './cache';
import type { GraphQLValue } from '../lib/types';
export declare class InMemorySubscriptions {
    private cache;
    constructor(cache: Cache);
    private subscribers;
    private referenceCounts;
    private keyVersions;
    add({ parent, spec, selection, variables, parentType, }: {
        parent: string;
        parentType?: string;
        spec: SubscriptionSpec;
        selection: SubscriptionSelection;
        variables: {
            [key: string]: GraphQLValue;
        };
    }): void;
    addFieldSubscription({ id, key, selection, spec, parentType, variables, }: {
        id: string;
        key: string;
        selection: SubscriptionSelection[string];
        spec: SubscriptionSpec;
        parentType: string;
        variables: GraphQLObject;
    }): void;
    addMany({ parent, selection, variables, subscribers, }: {
        parent: string;
        selection: SubscriptionSelection;
        variables: {};
        subscribers: SubscriptionSpec[];
    }): void;
    get(id: string, field: string): SubscriptionSpec[];
    remove(id: string, fields: SubscriptionSelection, targets: SubscriptionSpec[], variables: {}, visited?: string[]): void;
    private removeSubscribers;
    removeAllSubscribers(id: string, targets?: SubscriptionSpec[], visited?: string[]): void;
}
