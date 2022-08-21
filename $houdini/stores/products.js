import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/products'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_products",
    paginated: false,
    paginationMethods: [],
})

export const GQL_products = factory()

export const productsStore = factory

export default GQL_products
