import type { address$input, address$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_address: QueryStore<address$result | undefined, address$input, {}> 

export declare const addressStore: () => typeof GQL_address

export default GQL_address
