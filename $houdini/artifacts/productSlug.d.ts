export type productSlug = {
    readonly "input": productSlug$input,
    readonly "result": productSlug$result | undefined
};

export type productSlug$result = {
    readonly productSlug: {
        readonly id: string | null,
        readonly name: string | null,
        readonly description: string | null,
        readonly metaDescription: string | null,
        readonly createdAt: string,
        readonly updatedAt: string,
        readonly sku: string | null,
        readonly hsn: string | null,
        readonly popularity: number | null,
        readonly slug: string | null,
        readonly img: string | null,
        readonly imgCdn: string | null,
        readonly images: (string | null)[] | null,
        readonly imagesCdn: (string | null)[] | null,
        readonly price: number | null,
        readonly mrp: number | null,
        readonly formattedPrice: string | null,
        readonly formattedMrp: string | null,
        readonly stock: number | null,
        readonly isUnlimited: boolean | null,
        readonly trackInventory: boolean | null,
        readonly ratings: number | null,
        readonly reviews: number | null,
        readonly returnInfo: string | null,
        readonly replaceValidityInDays: number | null,
        readonly returnAllowed: boolean | null,
        readonly replaceAllowed: boolean | null,
        readonly color: {
            readonly id: string,
            readonly name: string | null
        } | null,
        readonly size: {
            readonly name: string | null
        } | null,
        readonly brand: {
            readonly name: string | null
        } | null,
        readonly vendor: {
            readonly id: string | null,
            readonly slug: string | null,
            readonly businessName: string | null,
            readonly banner: string | null,
            readonly bannerCdn: string | null,
            readonly ratings: number | null,
            readonly reviews: number | null,
            readonly info: {
                readonly store: string | null,
                readonly public: boolean | null,
                readonly storePhotos: (string | null)[] | null
            } | null
        } | null
    } | null
};

export type productSlug$afterLoad = {
    readonly "input": {
        readonly "productSlug": productSlug$input
    },
    readonly "data": {
        readonly "productSlug": productSlug$result
    }
};

export type productSlug$input = {
    slug: string
};