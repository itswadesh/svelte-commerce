import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/settings'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_settings",
    paginated: false,
    paginationMethods: [],
})

export const GQL_settings = factory()

export const settingsStore = factory

export default GQL_settings
