import { Cache } from './cache';
export declare class GarbageCollector {
    cache: Cache;
    private lifetimes;
    readonly cacheBufferSize: number;
    constructor(cache: Cache, bufferSize?: number);
    resetLifetime(id: string, field: string): void;
    tick(): void;
}
