import type { categories$input, categories$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_categories: QueryStore<categories$result | undefined, categories$input, {}> 

export declare const categoriesStore: () => typeof GQL_categories

export default GQL_categories
