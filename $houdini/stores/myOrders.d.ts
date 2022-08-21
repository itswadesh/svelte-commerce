import type { myOrders$input, myOrders$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_myOrders: QueryStore<myOrders$result | undefined, myOrders$input, {}> 

export declare const myOrdersStore: () => typeof GQL_myOrders

export default GQL_myOrders
