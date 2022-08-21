import type { vendorProfile$input, vendorProfile$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_vendorProfile: QueryStore<vendorProfile$result | undefined, vendorProfile$input, {}> 

export declare const vendorProfileStore: () => typeof GQL_vendorProfile

export default GQL_vendorProfile
