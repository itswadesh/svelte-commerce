import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/INIT'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_INIT",
    paginated: false,
    paginationMethods: [],
})

export const GQL_INIT = factory()

export const INITStore = factory

export default GQL_INIT
