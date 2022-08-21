import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/country'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_country",
    paginated: false,
    paginationMethods: [],
})

export const GQL_country = factory()

export const countryStore = factory

export default GQL_country
