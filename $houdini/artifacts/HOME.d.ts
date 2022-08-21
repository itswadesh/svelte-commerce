export type HOME = {
    readonly "input": HOME$input,
    readonly "result": HOME$result | undefined
};

export type HOME$result = {
    readonly brands: {
        readonly count: number | null,
        readonly page: number | null,
        readonly pageSize: number | null,
        readonly data: ({
            readonly id: string,
            readonly brandId: string | null,
            readonly name: string | null,
            readonly slug: string | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly position: number | null,
            readonly info: string | null,
            readonly meta: string | null,
            readonly metaTitle: string | null,
            readonly metaDescription: string | null,
            readonly metaKeywords: string | null,
            readonly facebookUrl: string | null,
            readonly instaUrl: string | null,
            readonly twitterUrl: string | null,
            readonly linkedinUrl: string | null,
            readonly youtubeUrl: string | null,
            readonly pinterestUrl: string | null,
            readonly googleUrl: string | null,
            readonly active: boolean | null,
            readonly featured: boolean | null,
            readonly store: {
                readonly id: string,
                readonly name: string | null,
                readonly email: string | null,
                readonly phone: string | null,
                readonly active: boolean | null
            } | null,
            readonly createdAt: string,
            readonly updatedAt: string
        } | null)[] | null
    } | null,
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
            readonly link: string | null,
            readonly level: number | null,
            readonly metaTitle: string | null,
            readonly metaDescription: string | null,
            readonly metaKeywords: string | null,
            readonly position: number | null,
            readonly megamenu: boolean | null,
            readonly active: boolean | null,
            readonly featured: boolean | null,
            readonly shopbycategory: boolean | null,
            readonly createdAt: string | null,
            readonly updatedAt: string | null,
            readonly store: string | null
        } | null)[] | null
    } | null,
    readonly banners: {
        readonly count: number | null,
        readonly page: number | null,
        readonly pageSize: number | null,
        readonly data: ({
            readonly id: string,
            readonly link: string | null,
            readonly heading: string | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly sort: number | null,
            readonly type: string | null,
            readonly pageId: string | null,
            readonly groupId: string | null,
            readonly groupTitle: string | null,
            readonly active: boolean | null,
            readonly isMobile: boolean | null,
            readonly createdAt: string,
            readonly updatedAt: string,
            readonly store: string | null
        } | null)[] | null
    } | null,
    readonly youMayLike: ({
        readonly id: string | null,
        readonly sku: string | null,
        readonly barcode: string | null,
        readonly description: string | null,
        readonly productMasterId: string | null,
        readonly slug: string | null,
        readonly name: string | null,
        readonly type: string | null,
        readonly foodType: string | null,
        readonly price: number | null,
        readonly mrp: number | null,
        readonly stock: number | null,
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
        readonly ratings: number | null,
        readonly reviews: number | null,
        readonly itemId: string | null,
        readonly warranty: string | null,
        readonly discount: number | null,
        readonly ageMin: number | null,
        readonly ageMax: number | null,
        readonly ageUnit: string | null,
        readonly cgst: number | null,
        readonly sgst: number | null,
        readonly igst: number | null,
        readonly returnInfo: string | null,
        readonly keyFeatures: (string | null)[] | null,
        readonly expiryDate: string | null,
        readonly vendor: {
            readonly businessName: string | null
        } | null,
        readonly productDetails: ({
            readonly name: string | null,
            readonly value: string | null
        } | null)[] | null,
        readonly specifications: ({
            readonly name: string | null,
            readonly value: string | null
        } | null)[] | null,
        readonly countryOfOrigin: string | null
    } | null)[] | null,
    readonly trending: ({
        readonly id: string | null,
        readonly sku: string | null,
        readonly barcode: string | null,
        readonly description: string | null,
        readonly productMasterId: string | null,
        readonly slug: string | null,
        readonly name: string | null,
        readonly type: string | null,
        readonly foodType: string | null,
        readonly price: number | null,
        readonly mrp: number | null,
        readonly stock: number | null,
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
        readonly ratings: number | null,
        readonly reviews: number | null,
        readonly itemId: string | null,
        readonly warranty: string | null,
        readonly discount: number | null,
        readonly ageMin: number | null,
        readonly ageMax: number | null,
        readonly ageUnit: string | null,
        readonly cgst: number | null,
        readonly sgst: number | null,
        readonly igst: number | null,
        readonly returnInfo: string | null,
        readonly keyFeatures: (string | null)[] | null,
        readonly expiryDate: string | null,
        readonly vendor: {
            readonly businessName: string | null
        } | null,
        readonly productDetails: ({
            readonly name: string | null,
            readonly value: string | null
        } | null)[] | null,
        readonly specifications: ({
            readonly name: string | null,
            readonly value: string | null
        } | null)[] | null,
        readonly countryOfOrigin: string | null
    } | null)[] | null,
    readonly popular: {
        readonly data: ({
            readonly id: string | null,
            readonly slug: string | null,
            readonly name: string | null,
            readonly type: string | null,
            readonly price: number | null,
            readonly mrp: number | null,
            readonly discount: number | null,
            readonly stock: number | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly images: (string | null)[] | null,
            readonly imagesCdn: (string | null)[] | null,
            readonly time: string | null,
            readonly ratings: number | null,
            readonly reviews: number | null,
            readonly zips: (string)[] | null,
            readonly foodType: string | null,
            readonly expiryDate: string | null,
            readonly vendor: {
                readonly id: string | null,
                readonly slug: string | null,
                readonly businessName: string | null,
                readonly banner: string | null,
                readonly bannerCdn: string | null
            } | null
        } | null)[] | null,
        readonly count: number | null,
        readonly pageSize: number | null,
        readonly page: number | null
    } | null,
    readonly groupByBanner: ({
        readonly _id: {
            readonly title: string | null,
            readonly type: string | null
        } | null,
        readonly data: ({
            readonly link: string | null,
            readonly heading: string | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly sort: number | null,
            readonly type: string | null,
            readonly pageId: string | null,
            readonly store: string | null,
            readonly active: boolean | null,
            readonly groupId: string | null,
            readonly groupTitle: string | null,
            readonly createdAt: string,
            readonly updatedAt: string
        } | null)[] | null
    } | null)[] | null
};

export type HOME$afterLoad = {
    readonly "input": {
        readonly "HOME": HOME$input
    },
    readonly "data": {
        readonly "HOME": HOME$result
    }
};

export type HOME$input = {
    store?: string | null | undefined,
    zip?: string | null | undefined
};