import type { products$input, products$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_products: QueryStore<products$result | undefined, products$input, {}> 

export declare const productsStore: () => typeof GQL_products

export default GQL_products
