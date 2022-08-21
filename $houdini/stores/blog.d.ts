import type { blog$input, blog$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_blog: QueryStore<blog$result | undefined, blog$input, {}> 

export declare const blogStore: () => typeof GQL_blog

export default GQL_blog
