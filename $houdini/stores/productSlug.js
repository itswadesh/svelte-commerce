import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/productSlug'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_productSlug",
    paginated: false,
    paginationMethods: [],
})

export const GQL_productSlug = factory()

export const productSlugStore = factory

export default GQL_productSlug
