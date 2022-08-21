import type { paymentMethodsAdmin$input, paymentMethodsAdmin$result, CachePolicy } from '$houdini'
import { type QueryStore } from '../runtime/lib/types'


export declare const GQL_paymentMethodsAdmin: QueryStore<paymentMethodsAdmin$result | undefined, paymentMethodsAdmin$input, {}> 

export declare const paymentMethodsAdminStore: () => typeof GQL_paymentMethodsAdmin

export default GQL_paymentMethodsAdmin
