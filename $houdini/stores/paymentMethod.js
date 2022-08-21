import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/paymentMethod'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_paymentMethod",
    paginated: false,
    paginationMethods: [],
})

export const GQL_paymentMethod = factory()

export const paymentMethodStore = factory

export default GQL_paymentMethod
