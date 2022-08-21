import type { Writable } from 'svelte/store';
export declare function sessionStore<_State>(context: Parameters<typeof currentReqID>[0], home: {
    [key: string]: Writable<_State>;
}, initialState: () => _State): Writable<_State>;
export declare function currentReqID(context: {
    session: () => App.Session | null;
} | null | App.Session, home: {
    [key: string]: any;
}): string;
