import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/categories'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_categories",
    paginated: false,
    paginationMethods: [],
})

export const GQL_categories = factory()

export const categoriesStore = factory

export default GQL_categories
