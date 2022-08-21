import type { storeCountry$input, storeCountry$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_storeCountry: QueryStore<storeCountry$result | undefined, storeCountry$input, {}> 

export declare const storeCountryStore: () => typeof GQL_storeCountry

export default GQL_storeCountry
