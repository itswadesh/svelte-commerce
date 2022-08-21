import type { productReviews$input, productReviews$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_productReviews: QueryStore<productReviews$result | undefined, productReviews$input, {}> 

export declare const productReviewsStore: () => typeof GQL_productReviews

export default GQL_productReviews
