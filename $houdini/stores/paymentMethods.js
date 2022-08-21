import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/paymentMethods'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_paymentMethods",
    paginated: false,
    paginationMethods: [],
})

export const GQL_paymentMethods = factory()

export const paymentMethodsStore = factory

export default GQL_paymentMethods
