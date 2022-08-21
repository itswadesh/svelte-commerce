import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/storeOne'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_storeOne",
    paginated: false,
    paginationMethods: [],
})

export const GQL_storeOne = factory()

export const storeOneStore = factory

export default GQL_storeOne
