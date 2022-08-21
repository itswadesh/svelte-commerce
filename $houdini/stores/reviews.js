import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/reviews'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_reviews",
    paginated: false,
    paginationMethods: [],
})

export const GQL_reviews = factory()

export const reviewsStore = factory

export default GQL_reviews
