export type vendorProfile = {
    readonly "input": vendorProfile$input,
    readonly "result": vendorProfile$result | undefined
};

export type vendorProfile$result = {
    readonly vendorProfile: {
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
        readonly products: {
            readonly count: number | null,
            readonly page: number | null,
            readonly pageSize: number | null,
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
                readonly deliveryDetails: string | null
            } | null)[] | null
        } | null,
        readonly createdAt: string | null,
        readonly updatedAt: string | null
    } | null
};

export type vendorProfile$afterLoad = {
    readonly "input": {
        readonly "vendorProfile": vendorProfile$input
    },
    readonly "data": {
        readonly "vendorProfile": vendorProfile$result
    }
};

export type vendorProfile$input = {
    vendor: string
};