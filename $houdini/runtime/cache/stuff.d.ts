import { GraphQLValue } from '..';
import { LinkedList } from './cache';
export declare function flattenList<T>(source: LinkedList<T>): T[];
export declare function evaluateKey(key: string, variables?: {
    [key: string]: GraphQLValue;
}): string;
