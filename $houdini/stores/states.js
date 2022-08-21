import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/states'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_states",
    paginated: false,
    paginationMethods: [],
})

export const GQL_states = factory()

export const statesStore = factory

export default GQL_states
