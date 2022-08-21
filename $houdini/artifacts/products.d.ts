export type products = {
    readonly "input": products$input,
    readonly "result": products$result | undefined
};

export type products$result = {
    readonly products: {
        readonly count: number | null,
        readonly pageSize: number | null,
        readonly noOfPage: number | null,
        readonly page: number | null,
        readonly data: ({
            readonly id: string | null,
            readonly sku: string | null,
            readonly barcode: string | null,
            readonly productMasterId: string | null,
            readonly slug: string | null,
            readonly name: string | null,
            readonly description: string | null,
            readonly type: string | null,
            readonly price: number | null,
            readonly mrp: number | null,
            readonly stock: number | null,
            readonly trackInventory: boolean | null,
            readonly tax: number | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly images: (string | null)[] | null,
            readonly imagesCdn: (string | null)[] | null,
            readonly time: string | null,
            readonly active: boolean | null,
            readonly popularity: number | null,
            readonly position: number | null,
            readonly trending: boolean | null,
            readonly featured: boolean | null,
            readonly hot: boolean | null,
            readonly new: boolean | null,
            readonly sale: boolean | null,
            readonly recommended: boolean | null,
            readonly title: string | null,
            readonly metaDescription: string | null,
            readonly keywords: string | null,
            readonly keywordsA: (string | null)[] | null,
            readonly ratings: number | null,
            readonly reviews: number | null,
            readonly itemId: string | null,
            readonly warranty: string | null,
            readonly ageMin: number | null,
            readonly ageMax: number | null,
            readonly ageUnit: string | null,
            readonly cgst: number | null,
            readonly sgst: number | null,
            readonly igst: number | null,
            readonly returnInfo: string | null,
            readonly returnAllowed: boolean | null,
            readonly replaceAllowed: boolean | null,
            readonly returnValidityInDays: number | null,
            readonly sizechart: string | null,
            readonly batchNo: string | null,
            readonly mfgDate: string | null,
            readonly expired: boolean | null,
            readonly expiryDate: string | null,
            readonly isSearchable: boolean | null,
            readonly isUnlimited: boolean | null,
            readonly totalSold: number | null,
            readonly preOrder: boolean | null,
            readonly zips: (string)[] | null,
            readonly foodType: string | null,
            readonly deliveryDetails: string | null,
            readonly formattedMrp: string | null,
            readonly formattedPrice: string | null,
            readonly slots: ({
                readonly id: string | null,
                readonly name: string | null,
                readonly value: string | null
            } | null)[] | null,
            readonly store: {
                readonly id: string,
                readonly name: string | null,
                readonly email: string | null
            } | null,
            readonly category: {
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
        } | null)[] | null
    } | null
};

export type products$afterLoad = {
    readonly "input": {
        readonly "products": products$input
    },
    readonly "data": {
        readonly "products": products$result
    }
};

export type products$input = {
    page?: number | null | undefined,
    skip?: number | null | undefined,
    limit?: number | null | undefined,
    search?: string | null | undefined,
    sku?: string | null | undefined,
    name?: string | null | undefined,
    brand?: string | null | undefined,
    status?: string | null | undefined,
    price?: string | null | undefined,
    sort?: string | null | undefined,
    vendor?: string | null | undefined,
    category?: string | null | undefined,
    active?: boolean | null | undefined,
    featured?: boolean | null | undefined,
    new?: boolean | null | undefined,
    hot?: boolean | null | undefined,
    sale?: boolean | null | undefined,
    where?: string | null | undefined,
    store?: string | null | undefined,
    types?: (string | null | undefined)[] | null | undefined
};