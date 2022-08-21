import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/vendorProfile'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_vendorProfile",
    paginated: false,
    paginationMethods: [],
})

export const GQL_vendorProfile = factory()

export const vendorProfileStore = factory

export default GQL_vendorProfile
