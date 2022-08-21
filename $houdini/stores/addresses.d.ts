import type { addresses$input, addresses$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_addresses: QueryStore<addresses$result | undefined, addresses$input, {}> 

export declare const addressesStore: () => typeof GQL_addresses

export default GQL_addresses
