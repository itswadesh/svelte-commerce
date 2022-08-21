// locals
import { getHoudiniContext } from '../lib';
export function mutation(document) {
    // make sure we got a query document
    if (document.kind !== 'HoudiniMutation') {
        throw new Error('mutation() must be passed a mutation document');
    }
    const context = getHoudiniContext();
    return async (variables, mutationConfig) => {
        const { data } = await document.store.mutate({
            variables,
            ...mutationConfig,
            context,
        });
        return data;
    };
}
