import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/address'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_address",
    paginated: false,
    paginationMethods: [],
})

export const GQL_address = factory()

export const addressStore = factory

export default GQL_address
