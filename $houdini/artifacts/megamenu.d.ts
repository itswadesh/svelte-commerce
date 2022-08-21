export type megamenu = {
    readonly "input": megamenu$input,
    readonly "result": megamenu$result | undefined
};

export type megamenu$result = {
    readonly megamenu: ({
        readonly id: string,
        readonly name: string | null,
        readonly slug: string | null,
        readonly img: string | null,
        readonly imgCdn: string | null,
        readonly banner: string | null,
        readonly bannerCdn: string | null,
        readonly featured: boolean | null,
        readonly link: string | null,
        readonly children: ({
            readonly name: string | null,
            readonly slug: string | null,
            readonly img: string | null,
            readonly featured: boolean | null,
            readonly link: string | null,
            readonly children: ({
                readonly name: string | null,
                readonly slug: string | null,
                readonly img: string | null,
                readonly featured: boolean | null,
                readonly link: string | null,
                readonly children: ({
                    readonly name: string | null,
                    readonly slug: string | null,
                    readonly img: string | null,
                    readonly featured: boolean | null,
                    readonly link: string | null,
                    readonly children: ({
                        readonly name: string | null,
                        readonly slug: string | null,
                        readonly img: string | null,
                        readonly featured: boolean | null,
                        readonly link: string | null,
                        readonly children: ({
                            readonly name: string | null,
                            readonly slug: string | null,
                            readonly img: string | null,
                            readonly featured: boolean | null,
                            readonly link: string | null,
                            readonly children: ({
                                readonly name: string | null,
                                readonly slug: string | null,
                                readonly img: string | null,
                                readonly featured: boolean | null,
                                readonly children: ({
                                    readonly name: string | null,
                                    readonly slug: string | null,
                                    readonly img: string | null,
                                    readonly featured: boolean | null,
                                    readonly children: ({
                                        readonly name: string | null,
                                        readonly slug: string | null,
                                        readonly img: string | null,
                                        readonly featured: boolean | null,
                                        readonly children: ({
                                            readonly name: string | null,
                                            readonly slug: string | null,
                                            readonly img: string | null,
                                            readonly featured: boolean | null
                                        } | null)[] | null
                                    } | null)[] | null
                                } | null)[] | null
                            } | null)[] | null
                        } | null)[] | null
                    } | null)[] | null
                } | null)[] | null
            } | null)[] | null
        } | null)[] | null
    } | null)[] | null
};

export type megamenu$afterLoad = {
    readonly "input": {
        readonly "megamenu": megamenu$input
    },
    readonly "data": {
        readonly "megamenu": megamenu$result
    }
};

export type megamenu$input = {
    id?: string | null | undefined,
    slug?: string | null | undefined,
    search?: string | null | undefined,
    sort?: string | null | undefined,
    featured?: boolean | null | undefined,
    brand?: string | null | undefined,
    store?: string | null | undefined
};