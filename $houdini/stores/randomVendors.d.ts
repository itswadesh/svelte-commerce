import type { randomVendors$input, randomVendors$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_randomVendors: QueryStore<randomVendors$result | undefined, randomVendors$input, {}> 

export declare const randomVendorsStore: () => typeof GQL_randomVendors

export default GQL_randomVendors
