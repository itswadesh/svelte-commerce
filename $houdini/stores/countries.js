import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/countries'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_countries",
    paginated: false,
    paginationMethods: [],
})

export const GQL_countries = factory()

export const countriesStore = factory

export default GQL_countries
