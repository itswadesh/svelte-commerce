export type storeCountries = {
    readonly "input": storeCountries$input,
    readonly "result": storeCountries$result | undefined
};

export type storeCountries$result = {
    readonly storeCountries: {
        readonly count: number | null,
        readonly page: number | null,
        readonly pageSize: number | null,
        readonly data: ({
            readonly id: string | null,
            readonly default: boolean | null,
            readonly active: boolean | null,
            readonly name: string | null,
            readonly code: string | null,
            readonly country: {
                readonly id: string,
                readonly name: string,
                readonly value: string | null,
                readonly dialCode: string | null,
                readonly code: string | null,
                readonly img: string | null,
                readonly imgCdn: string | null,
                readonly flag: string | null,
                readonly lang: string | null
            } | null,
            readonly user: {
                readonly id: string | null,
                readonly firstName: string | null,
                readonly lastName: string | null,
                readonly email: string | null
            } | null
        } | null)[] | null
    } | null
};

export type storeCountries$afterLoad = {
    readonly "input": {
        readonly "storeCountries": storeCountries$input
    },
    readonly "data": {
        readonly "storeCountries": storeCountries$result
    }
};

export type storeCountries$input = {
    page?: number | null | undefined,
    search?: string | null | undefined,
    limit?: number | null | undefined,
    sort?: string | null | undefined,
    store: string
};