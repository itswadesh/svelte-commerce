import { houdiniConfig } from '$houdini';
import { queryStore } from '../runtime/stores'
import artifact from '../artifacts/storeCountry'
import { defaultConfigValues } from '../runtime/lib'

// create the query store
const factory = () => queryStore({
    artifact,
    config: defaultConfigValues(houdiniConfig),
    storeName: "GQL_storeCountry",
    paginated: false,
    paginationMethods: [],
})

export const GQL_storeCountry = factory()

export const storeCountryStore = factory

export default GQL_storeCountry
