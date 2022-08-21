import type { category$input, category$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_category: QueryStore<category$result | undefined, category$input, {}> 

export declare const categoryStore: () => typeof GQL_category

export default GQL_category
