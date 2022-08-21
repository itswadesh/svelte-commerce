import { SubscriptionSelection, ListWhen, SubscriptionSpec } from '../lib/types';
import { Cache } from './cache';
export declare class ListManager {
    rootID: string;
    cache: Cache;
    constructor(cache: Cache, rootID: string);
    lists: Map<string, Map<string, ListCollection>>;
    private listsByField;
    get(listName: string, id?: string | {}): ListCollection | null | undefined;
    remove(listName: string, id: string): void;
    add(list: {
        name: string;
        connection: boolean;
        recordID: SubscriptionSpec['parentID'];
        recordType?: string;
        key: string;
        listType: string;
        selection: SubscriptionSelection;
        when?: ListWhen;
        filters?: List['filters'];
        abstract?: boolean;
    }): void;
    removeIDFromAllLists(id: string): void;
    deleteField(parentID: string, field: string): void;
}
export declare class List {
    readonly recordID: string;
    readonly recordType?: string;
    readonly key: string;
    readonly type: string;
    private cache;
    readonly selection: SubscriptionSelection;
    private _when?;
    private filters?;
    readonly name: string;
    private connection;
    private manager;
    private abstract?;
    constructor({ name, recordID, recordType, key, listType, selection, when, filters, connection, manager, abstract, }: Parameters<ListManager['add']>[0] & {
        manager: ListManager;
    });
    when(when?: ListWhen): ListCollection;
    append(selection: SubscriptionSelection, data: {}, variables?: {}): void;
    prepend(selection: SubscriptionSelection, data: {}, variables?: {}): void;
    addToList(selection: SubscriptionSelection, data: {}, variables: {} | undefined, where: 'first' | 'last'): void;
    removeID(id: string, variables?: {}): true | undefined;
    remove(data: {}, variables?: {}): true | undefined;
    listType(data: {
        __typename?: string;
    }): string;
    validateWhen(when?: ListWhen): boolean;
    toggleElement(selection: SubscriptionSelection, data: {}, variables: {} | undefined, where: 'first' | 'last'): void;
    [Symbol.iterator](): Generator<string, void, unknown>;
}
export declare class ListCollection {
    lists: List[];
    constructor(lists: List[]);
    append(...args: Parameters<List['append']>): void;
    prepend(...args: Parameters<List['prepend']>): void;
    addToList(...args: Parameters<List['addToList']>): void;
    removeID(...args: Parameters<List['removeID']>): void;
    remove(...args: Parameters<List['remove']>): void;
    toggleElement(...args: Parameters<List['toggleElement']>): void;
    when(when?: ListWhen): ListCollection;
    includes(key: string): boolean;
    deleteListWithKey(key: string): List[];
    [Symbol.iterator](): Generator<string, void, unknown>;
}
