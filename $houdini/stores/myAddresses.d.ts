import type { myAddresses$input, myAddresses$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_myAddresses: QueryStore<myAddresses$result | undefined, myAddresses$input, {}> 

export declare const myAddressesStore: () => typeof GQL_myAddresses

export default GQL_myAddresses
