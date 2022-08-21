import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/orderItem'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_orderItem",
    paginated: false,
    paginationMethods: [],
})

export const GQL_orderItem = factory()

export const orderItemStore = factory

export default GQL_orderItem
