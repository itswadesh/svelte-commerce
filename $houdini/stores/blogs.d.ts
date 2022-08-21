import type { blogs$input, blogs$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_blogs: QueryStore<blogs$result | undefined, blogs$input, {}> 

export declare const blogsStore: () => typeof GQL_blogs

export default GQL_blogs
