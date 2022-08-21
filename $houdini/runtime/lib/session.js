import { writable } from 'svelte/store';
import { isBrowser } from '../adapter';
export function sessionStore(context, home, initialState) {
    const reqID = currentReqID(context, home);
    // if we dont have an entry for this reqID already,  create one
    if (!home[reqID]) {
        home[reqID] = writable(initialState());
    }
    // there is an entry for the id, return it and the id we computed
    return home[reqID];
}
export function currentReqID(context, home) {
    let session = null;
    if (isBrowser) {
        return 'CLIENT';
    }
    // if we were given a context, we need to pull the session out
    if (context && 'session' in context) {
        session = typeof context.session === 'function' ? context.session() : context.session;
    }
    else {
        session = context;
    }
    // @ts-ignore
    // get the reqID from the session
    let { __houdini_session_key: reqID } = session !== null && session !== void 0 ? session : {};
    // if we already have a reqID, use it
    if (reqID) {
        return reqID;
    }
    // make sure that reqID isn't currently being used
    while (!reqID || home[reqID]) {
        reqID = Math.random().toString();
    }
    // save the session
    if (session) {
        // @ts-ignore
        session.__houdini_session_key = reqID;
    }
    // return the id we computed
    return reqID;
}
