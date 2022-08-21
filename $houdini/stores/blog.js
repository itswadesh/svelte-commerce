import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/blog'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_blog",
    paginated: false,
    paginationMethods: [],
})

export const GQL_blog = factory()

export const blogStore = factory

export default GQL_blog
