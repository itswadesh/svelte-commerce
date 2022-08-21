export type category = {
    readonly "input": category$input,
    readonly "result": category$result | undefined
};

export type category$result = {
    readonly category: {
        readonly id: string,
        readonly name: string | null,
        readonly categoryId: string | null,
        readonly description: string | null,
        readonly slug: string | null,
        readonly img: string | null,
        readonly imgCdn: string | null,
        readonly banner: string | null,
        readonly bannerCdn: string | null,
        readonly level: number | null,
        readonly link: string | null,
        readonly pathA: ({
            readonly slug: string | null,
            readonly name: string | null
        } | null)[] | null,
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
        readonly parent: {
            readonly name: string | null
        } | null,
        readonly children: ({
            readonly id: string,
            readonly name: string | null,
            readonly img: string | null
        } | null)[] | null,
        readonly attributes: ({
            readonly id: string,
            readonly name: string | null,
            readonly show: boolean | null,
            readonly category: string | null,
            readonly active: boolean | null
        } | null)[] | null,
        readonly brand: {
            readonly id: string,
            readonly name: string | null
        } | null
    } | null
};

export type category$afterLoad = {
    readonly "input": {
        readonly "category": category$input
    },
    readonly "data": {
        readonly "category": category$result
    }
};

export type category$input = {
    id?: string | null | undefined,
    slug?: string | null | undefined
};