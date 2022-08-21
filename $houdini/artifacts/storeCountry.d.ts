export type storeCountry = {
    readonly "input": storeCountry$input,
    readonly "result": storeCountry$result | undefined
};

export type storeCountry$result = {
    readonly storeCountry: {
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
            readonly lastName: string | null
        } | null
    } | null
};

export type storeCountry$afterLoad = {
    readonly "input": {
        readonly "storeCountry": storeCountry$input
    },
    readonly "data": {
        readonly "storeCountry": storeCountry$result
    }
};

export type storeCountry$input = {
    id: string
};