import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/paymentMethodsAdmin'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_paymentMethodsAdmin",
    paginated: false,
    paginationMethods: [],
})

export const GQL_paymentMethodsAdmin = factory()

export const paymentMethodsAdminStore = factory

export default GQL_paymentMethodsAdmin
