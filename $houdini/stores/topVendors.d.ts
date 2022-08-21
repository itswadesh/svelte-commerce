import type { topVendors$input, topVendors$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_topVendors: QueryStore<topVendors$result | undefined, topVendors$input, {}> 

export declare const topVendorsStore: () => typeof GQL_topVendors

export default GQL_topVendors
