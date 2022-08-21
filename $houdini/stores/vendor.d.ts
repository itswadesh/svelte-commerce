import type { vendor$input, vendor$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_vendor: QueryStore<vendor$result | undefined, vendor$input, {}> 

export declare const vendorStore: () => typeof GQL_vendor

export default GQL_vendor
