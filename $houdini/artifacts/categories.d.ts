export type categories = {
    readonly "input": categories$input,
    readonly "result": categories$result | undefined
};

export type categories$result = {
    readonly categories: {
        readonly count: number | null,
        readonly page: number | null,
        readonly pageSize: number | null,
        readonly data: ({
            readonly id: string,
            readonly name: string | null,
            readonly namePath: string | null,
            readonly categoryId: string | null,
            readonly parent: string | null,
            readonly slug: string | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly banner: string | null,
            readonly bannerCdn: string | null,
            readonly level: number | null,
            readonly link: string | null,
            readonly metaTitle: string | null,
            readonly metaDescription: string | null,
            readonly metaKeywords: string | null,
            readonly keywords: string | null,
            readonly position: number | null,
            readonly megamenu: boolean | null,
            readonly active: boolean | null,
            readonly featured: boolean | null,
            readonly featuredSort: number | null,
            readonly shopbycategory: boolean | null,
            readonly createdAt: string | null,
            readonly updatedAt: string | null,
            readonly store: string | null
        } | null)[] | null
    } | null
};

export type categories$afterLoad = {
    readonly "input": {
        readonly "categories": categories$input
    },
    readonly "data": {
        readonly "categories": categories$result
    }
};

export type categories$input = {
    page?: number | null | undefined,
    search?: string | null | undefined,
    limit?: number | null | undefined,
    sort?: string | null | undefined,
    megamenu?: boolean | null | undefined,
    featured?: boolean | null | undefined,
    active?: boolean | null | undefined,
    img?: boolean | null | undefined,
    shopbycategory?: boolean | null | undefined,
    store?: string | null | undefined
};