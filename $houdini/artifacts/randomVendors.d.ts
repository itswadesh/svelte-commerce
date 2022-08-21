export type randomVendors = {
    readonly "input": randomVendors$input,
    readonly "result": randomVendors$result | undefined
};

export type randomVendors$result = {
    readonly randomVendors: ({
        readonly id: string | null,
        readonly slug: string | null,
        readonly businessName: string | null,
        readonly description: string | null,
        readonly verified: boolean | null,
        readonly bankAccountNo: number | null,
        readonly bankName: string | null,
        readonly bankIfsc: string | null,
        readonly bankAccountHolderName: string | null,
        readonly bankSwiftCode: string | null,
        readonly banner: string | null,
        readonly bannerCdn: string | null,
        readonly commissionType: string | null,
        readonly commissionValue: number | null,
        readonly zips: (string | null)[] | null,
        readonly freeShippingOn: number | null,
        readonly meta: string | null,
        readonly metaDescription: string | null,
        readonly metaKeywords: string | null,
        readonly metaTitle: string | null,
        readonly productSold: number | null,
        readonly ratings: number | null,
        readonly reviews: number | null,
        readonly shippingCharges: number | null,
        readonly storeName: string | null,
        readonly facebookUrl: string | null,
        readonly githubUrl: string | null,
        readonly googleUrl: string | null,
        readonly twitterUrl: string | null,
        readonly user: {
            readonly id: string | null,
            readonly avatar: string | null,
            readonly firstName: string | null,
            readonly lastName: string | null
        } | null,
        readonly address: {
            readonly id: string,
            readonly email: string | null,
            readonly firstName: string | null,
            readonly lastName: string | null,
            readonly address: string | null,
            readonly locality: string | null,
            readonly town: string | null,
            readonly city: string | null,
            readonly country: string | null,
            readonly state: string | null,
            readonly zip: string | null,
            readonly phone: string | null,
            readonly lat: number | null,
            readonly lng: number | null
        } | null,
        readonly categories: ({
            readonly id: string,
            readonly name: string | null,
            readonly img: string | null,
            readonly imgCdn: string | null
        } | null)[] | null,
        readonly createdAt: string | null,
        readonly updatedAt: string | null
    } | null)[] | null
};

export type randomVendors$afterLoad = {
    readonly "input": {
        readonly "randomVendors": randomVendors$input
    },
    readonly "data": {
        readonly "randomVendors": randomVendors$result
    }
};

export type randomVendors$input = {
    store?: string | null | undefined
};