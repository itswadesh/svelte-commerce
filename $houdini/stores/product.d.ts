import type { product$input, product$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_product: QueryStore<product$result | undefined, product$input, {}> 

export declare const productStore: () => typeof GQL_product

export default GQL_product
