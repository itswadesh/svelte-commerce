export type popularSearches = {
    readonly "input": popularSearches$input,
    readonly "result": popularSearches$result | undefined
};

export type popularSearches$result = {
    readonly popularSearches: {
        readonly count: number | null,
        readonly page: number | null,
        readonly pageSize: number | null,
        readonly data: ({
            readonly id: string,
            readonly text: string | null,
            readonly popularity: string | null,
            readonly store: {
                readonly id: string,
                readonly name: string | null,
                readonly email: string | null,
                readonly phone: string | null
            } | null
        } | null)[] | null
    } | null
};

export type popularSearches$afterLoad = {
    readonly "input": {
        readonly "popularSearches": popularSearches$input
    },
    readonly "data": {
        readonly "popularSearches": popularSearches$result
    }
};

export type popularSearches$input = {
    page?: number | null | undefined,
    limit?: number | null | undefined,
    search?: string | null | undefined,
    sort?: string | null | undefined,
    store?: string | null | undefined,
    domain?: string | null | undefined
};