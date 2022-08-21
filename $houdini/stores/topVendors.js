import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/topVendors'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_topVendors",
    paginated: false,
    paginationMethods: [],
})

export const GQL_topVendors = factory()

export const topVendorsStore = factory

export default GQL_topVendors
