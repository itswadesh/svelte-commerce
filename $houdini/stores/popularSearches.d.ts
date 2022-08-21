import type { popularSearches$input, popularSearches$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_popularSearches: QueryStore<popularSearches$result | undefined, popularSearches$input, {}> 

export declare const popularSearchesStore: () => typeof GQL_popularSearches

export default GQL_popularSearches
