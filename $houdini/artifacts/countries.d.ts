export type countries = {
    readonly "input": countries$input,
    readonly "result": countries$result | undefined
};

export type countries$result = {
    readonly countries: {
        readonly count: number | null,
        readonly page: number | null,
        readonly pageSize: number | null,
        readonly data: ({
            readonly id: string,
            readonly name: string,
            readonly value: string | null,
            readonly dialCode: string | null,
            readonly code: string | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly flag: string | null,
            readonly lang: string | null,
            readonly states: ({
                readonly name: string
            } | null)[] | null,
            readonly sort: number | null,
            readonly active: boolean | null
        } | null)[] | null
    } | null
};

export type countries$afterLoad = {
    readonly "input": {
        readonly "countries": countries$input
    },
    readonly "data": {
        readonly "countries": countries$result
    }
};

export type countries$input = {
    page?: number | null | undefined,
    search?: string | null | undefined,
    limit?: number | null | undefined,
    sort?: string | null | undefined
};