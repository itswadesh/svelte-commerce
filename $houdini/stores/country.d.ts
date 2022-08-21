import type { country$input, country$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_country: QueryStore<country$result | undefined, country$input, {}> 

export declare const countryStore: () => typeof GQL_country

export default GQL_country
