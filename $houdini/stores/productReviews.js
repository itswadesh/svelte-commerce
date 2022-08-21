import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/productReviews'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_productReviews",
    paginated: false,
    paginationMethods: [],
})

export const GQL_productReviews = factory()

export const productReviewsStore = factory

export default GQL_productReviews
