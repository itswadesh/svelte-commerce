import type { storeOne$input, storeOne$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_storeOne: QueryStore<storeOne$result | undefined, storeOne$input, {}> 

export declare const storeOneStore: () => typeof GQL_storeOne

export default GQL_storeOne
