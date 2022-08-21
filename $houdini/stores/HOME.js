import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/HOME'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_HOME",
    paginated: false,
    paginationMethods: [],
})

export const GQL_HOME = factory()

export const HOMEStore = factory

export default GQL_HOME
