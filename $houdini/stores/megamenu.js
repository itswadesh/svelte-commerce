import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/megamenu'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_megamenu",
    paginated: false,
    paginationMethods: [],
})

export const GQL_megamenu = factory()

export const megamenuStore = factory

export default GQL_megamenu
