import type { store$input, store$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_store: QueryStore<store$result | undefined, null, {}> 

export declare const storeStore: () => typeof GQL_store

export default GQL_store
