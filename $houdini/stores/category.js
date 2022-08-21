import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/category'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_category",
    paginated: false,
    paginationMethods: [],
})

export const GQL_category = factory()

export const categoryStore = factory

export default GQL_category
