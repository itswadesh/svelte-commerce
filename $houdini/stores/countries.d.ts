import type { countries$input, countries$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_countries: QueryStore<countries$result | undefined, countries$input, {}> 

export declare const countriesStore: () => typeof GQL_countries

export default GQL_countries
