export type blog = {
    readonly "input": blog$input,
    readonly "result": blog$result | undefined
};

export type blog$result = {
    readonly blog: {
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
    } | null
};

export type blog$afterLoad = {
    readonly "input": {
        readonly "blog": blog$input
    },
    readonly "data": {
        readonly "blog": blog$result
    }
};

export type blog$input = {
    id: string
};