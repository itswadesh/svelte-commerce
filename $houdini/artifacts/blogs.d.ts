export type blogs = {
    readonly "input": blogs$input,
    readonly "result": blogs$result | undefined
};

export type blogs$result = {
    readonly blogs: {
        readonly count: number | null,
        readonly page: number | null,
        readonly pageSize: number | null,
        readonly data: ({
            readonly id: string,
            readonly title: string | null,
            readonly slug: string | null,
            readonly active: boolean | null,
            readonly excerpt: string | null,
            readonly content: string | null,
            readonly published_at: string | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly createdAt: string,
            readonly updatedAt: string,
            readonly user: {
                readonly firstName: string | null,
                readonly lastName: string | null,
                readonly avatar: string | null
            } | null,
            readonly store: {
                readonly id: string,
                readonly name: string | null,
                readonly email: string | null,
                readonly phone: string | null
            } | null
        } | null)[] | null
    } | null
};

export type blogs$afterLoad = {
    readonly "input": {
        readonly "blogs": blogs$input
    },
    readonly "data": {
        readonly "blogs": blogs$result
    }
};

export type blogs$input = {
    page?: number | null | undefined,
    search?: string | null | undefined,
    limit?: number | null | undefined,
    sort?: string | null | undefined,
    store?: string | null | undefined
};