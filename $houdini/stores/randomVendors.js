import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/randomVendors'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_randomVendors",
    paginated: false,
    paginationMethods: [],
})

export const GQL_randomVendors = factory()

export const randomVendorsStore = factory

export default GQL_randomVendors
