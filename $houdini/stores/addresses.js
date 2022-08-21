import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/addresses'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_addresses",
    paginated: false,
    paginationMethods: [],
})

export const GQL_addresses = factory()

export const addressesStore = factory

export default GQL_addresses
