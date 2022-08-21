import type { reviews$input, reviews$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_reviews: QueryStore<reviews$result | undefined, reviews$input, {}> 

export declare const reviewsStore: () => typeof GQL_reviews

export default GQL_reviews
