export type saveBlog = {
    readonly "input": saveBlog$input,
    readonly "result": saveBlog$result
};

export type saveBlog$result = {
    readonly saveBlog: {
        readonly id: string,
        readonly title: string | null,
        readonly slug: string | null,
        readonly active: boolean | null,
        readonly excerpt: string | null,
        readonly content: string | null,
        readonly published_at: string | null,
        readonly img: string | null,
        readonly imgCdn: string | null,
        readonly tags: (string | null)[] | null
    } | null
};

export type saveBlog$input = {
    id: string,
    title?: string | null | undefined,
    slug?: string | null | undefined,
    excerpt?: string | null | undefined,
    content?: string | null | undefined,
    published_at?: string | null | undefined,
    img?: string | null | undefined,
    tags?: (string | null | undefined)[] | null | undefined,
    active?: boolean | null | undefined
};