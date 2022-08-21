import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/store'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_store",
    paginated: false,
    paginationMethods: [],
})

export const GQL_store = factory()

export const storeStore = factory

export default GQL_store
