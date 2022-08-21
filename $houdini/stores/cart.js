import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/cart'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_cart",
    paginated: false,
    paginationMethods: [],
})

export const GQL_cart = factory()

export const cartStore = factory

export default GQL_cart
