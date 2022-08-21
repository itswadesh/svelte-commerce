import type { storeCountries$input, storeCountries$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_storeCountries: QueryStore<storeCountries$result | undefined, storeCountries$input, {}> 

export declare const storeCountriesStore: () => typeof GQL_storeCountries

export default GQL_storeCountries
