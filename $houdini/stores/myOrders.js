import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/myOrders'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_myOrders",
    paginated: false,
    paginationMethods: [],
})

export const GQL_myOrders = factory()

export const myOrdersStore = factory

export default GQL_myOrders
