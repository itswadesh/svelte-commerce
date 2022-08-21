import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/vendor'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_vendor",
    paginated: false,
    paginationMethods: [],
})

export const GQL_vendor = factory()

export const vendorStore = factory

export default GQL_vendor
