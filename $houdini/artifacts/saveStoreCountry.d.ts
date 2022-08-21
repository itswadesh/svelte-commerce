export type saveStoreCountry = {
    readonly "input": saveStoreCountry$input,
    readonly "result": saveStoreCountry$result
};

export type saveStoreCountry$result = {
    readonly saveStoreCountry: {
        readonly id: string | null,
        readonly default: boolean | null,
        readonly active: boolean | null,
        readonly country: string | null,
        readonly name: string | null,
        readonly code: string | null,
        readonly user: string | null,
        readonly store: string | null
    } | null
};

export type saveStoreCountry$input = {
    id: string,
    country?: string | null | undefined,
    default?: boolean | null | undefined,
    active?: boolean | null | undefined
};