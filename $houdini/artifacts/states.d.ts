export type states = {
    readonly "input": states$input,
    readonly "result": states$result | undefined
};

export type states$result = {
    readonly states: {
        readonly count: number | null,
        readonly page: number | null,
        readonly pageSize: number | null,
        readonly data: ({
            readonly id: string,
            readonly name: string,
            readonly value: string | null,
            readonly code: string | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly flag: string | null,
            readonly lang: string | null,
            readonly sort: number | null,
            readonly active: boolean | null,
            readonly createdAt: string,
            readonly updatedAt: string
        } | null)[] | null
    } | null
};

export type states$afterLoad = {
    readonly "input": {
        readonly "states": states$input
    },
    readonly "data": {
        readonly "states": states$result
    }
};

export type states$input = {
    page?: number | null | undefined,
    search?: string | null | undefined,
    limit?: number | null | undefined,
    sort?: string | null | undefined,
    country?: string | null | undefined,
    countryCode?: string | null | undefined
};