import type { orderItem$input, orderItem$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_orderItem: QueryStore<orderItem$result | undefined, orderItem$input, {}> 

export declare const orderItemStore: () => typeof GQL_orderItem

export default GQL_orderItem
