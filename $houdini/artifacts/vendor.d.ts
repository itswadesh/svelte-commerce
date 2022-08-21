export type vendor = {
    readonly "input": vendor$input,
    readonly "result": vendor$result | undefined
};

export type vendor$result = {
    readonly vendor: {
        readonly id: string | null,
        readonly slug: string | null,
        readonly businessName: string | null,
        readonly categories: ({
            readonly id: string,
            readonly name: string | null
        } | null)[] | null,
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
        readonly about: string | null,
        readonly banners: (string | null)[] | null,
        readonly bannersCdn: (string | null)[] | null,
        readonly info: {
            readonly public: boolean | null,
            readonly store: string | null,
            readonly storePhotos: (string | null)[] | null
        } | null,
        readonly country: {
            readonly id: string,
            readonly name: string
        } | null,
        readonly user: {
            readonly id: string | null,
            readonly avatar: string | null
        } | null,
        readonly address: {
            readonly id: string,
            readonly firstName: string | null,
            readonly lastName: string | null,
            readonly address: string | null,
            readonly locality: string | null,
            readonly city: string | null,
            readonly state: string | null,
            readonly country: string | null,
            readonly zip: string | null,
            readonly lat: number | null,
            readonly lng: number | null
        } | null,
        readonly store: {
            readonly id: string,
            readonly name: string | null,
            readonly email: string | null
        } | null,
        readonly createdAt: string | null,
        readonly updatedAt: string | null
    } | null
};

export type vendor$afterLoad = {
    readonly "input": {
        readonly "vendor": vendor$input
    },
    readonly "data": {
        readonly "vendor": vendor$result
    }
};

export type vendor$input = {
    id?: string | null | undefined
};