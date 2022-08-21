import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/storeCountries'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_storeCountries",
    paginated: false,
    paginationMethods: [],
})

export const GQL_storeCountries = factory()

export const storeCountriesStore = factory

export default GQL_storeCountries
