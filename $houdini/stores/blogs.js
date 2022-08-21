import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/blogs'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_blogs",
    paginated: false,
    paginationMethods: [],
})

export const GQL_blogs = factory()

export const blogsStore = factory

export default GQL_blogs
