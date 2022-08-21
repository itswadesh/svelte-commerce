export type reviews = {
    readonly "input": reviews$input,
    readonly "result": reviews$result | undefined
};

export type reviews$result = {
    readonly reviews: {
        readonly count: number | null,
        readonly page: number | null,
        readonly pageSize: number | null,
        readonly data: ({
            readonly id: string,
            readonly rating: number | null,
            readonly message: string | null,
            readonly active: boolean | null,
            readonly createdAt: string,
            readonly updatedAt: string,
            readonly pid: {
                readonly name: string | null,
                readonly slug: string | null,
                readonly img: string | null,
                readonly imgCdn: string | null,
                readonly type: string | null
            } | null,
            readonly user: {
                readonly firstName: string | null,
                readonly lastName: string | null,
                readonly phone: string | null
            } | null,
            readonly vendor: {
                readonly id: string | null,
                readonly slug: string | null,
                readonly businessName: string | null,
                readonly banner: string | null,
                readonly bannerCdn: string | null
            } | null,
            readonly store: {
                readonly id: string,
                readonly name: string | null,
                readonly email: string | null
            } | null
        } | null)[] | null
    } | null
};

export type reviews$afterLoad = {
    readonly "input": {
        readonly "reviews": reviews$input
    },
    readonly "data": {
        readonly "reviews": reviews$result
    }
};

export type reviews$input = {
    page?: number | null | undefined,
    search?: string | null | undefined,
    limit?: number | null | undefined,
    sort?: string | null | undefined,
    store?: string | null | undefined
};