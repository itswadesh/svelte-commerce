import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/checkWishlist'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_checkWishlist",
    paginated: false,
    paginationMethods: [],
})

export const GQL_checkWishlist = factory()

export const checkWishlistStore = factory

export default GQL_checkWishlist
