import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/myOrderItems'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_myOrderItems",
    paginated: false,
    paginationMethods: [],
})

export const GQL_myOrderItems = factory()

export const myOrderItemsStore = factory

export default GQL_myOrderItems
