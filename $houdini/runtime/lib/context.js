// externals
import { getContext as svelteContext, setContext } from 'svelte';
import { get } from 'svelte/store';
// locals
import { getPage, getSession } from '../adapter';
import * as log from './log';
export const setVariables = (vars) => setContext('variables', vars);
export function nullHoudiniContext() {
    return {
        url: () => null,
        session: () => null,
        variables: async () => { },
        stuff: () => ({}),
    };
}
export function getHoudiniContext() {
    try {
        // hold onto references to the current session and url values
        const sessionStore = getSession();
        let session = null;
        sessionStore.subscribe((val) => (session = val));
        const pageStore = getPage();
        let { url, stuff } = get(pageStore);
        pageStore.subscribe((val) => {
            url = val.url;
            stuff = val.stuff;
        });
        return {
            url: () => url,
            session: () => session,
            variables: svelteContext('variables') || (() => ({})),
            stuff: () => stuff,
        };
    }
    catch (e) {
        log.info(`${log.red('⚠️ getHoudiniContext() was not called in the right place ⚠️')}
You should do something like the following. Make sure getHoudiniContext is 
called at the top of your component (outside any event handlers or function definitions).

<script lang="ts">
    const ${log.yellow('context')} = getHoudiniContext();
    const onClick = () => GQL_${log.cyan('[YOUR_STORE]')}.mutate({ ${log.yellow('context')} });
</script>`);
        throw new Error(e);
    }
}
