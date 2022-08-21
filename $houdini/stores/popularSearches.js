import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/popularSearches'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_popularSearches",
    paginated: false,
    paginationMethods: [],
})

export const GQL_popularSearches = factory()

export const popularSearchesStore = factory

export default GQL_popularSearches
