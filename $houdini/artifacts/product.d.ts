export type product = {
    readonly "input": product$input,
    readonly "result": product$result | undefined
};

export type product$result = {
    readonly product: {
        readonly id: string | null,
        readonly slug: string | null,
        readonly name: string | null,
        readonly description: string | null,
        readonly type: string | null,
        readonly price: number | null,
        readonly mrp: number | null,
        readonly discount: number | null,
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
        readonly ratings: number | null,
        readonly reviews: number | null,
        readonly sku: string | null,
        readonly hsn: string | null,
        readonly group: string | null,
        readonly barcode: string | null,
        readonly gender: string | null,
        readonly gtin: string | null,
        readonly condition: string | null,
        readonly trending: boolean | null,
        readonly featured: boolean | null,
        readonly hot: boolean | null,
        readonly new: boolean | null,
        readonly sale: boolean | null,
        readonly recommended: boolean | null,
        readonly title: string | null,
        readonly itemId: string | null,
        readonly warranty: string | null,
        readonly metaDescription: string | null,
        readonly keywords: string | null,
        readonly keywordsA: (string | null)[] | null,
        readonly ageMin: number | null,
        readonly ageMax: number | null,
        readonly ageUnit: string | null,
        readonly styleCode: string | null,
        readonly eanNo: string | null,
        readonly articleCode: string | null,
        readonly productMasterId: string | null,
        readonly currency: string | null,
        readonly manufacturer: string | null,
        readonly countryOfOrigin: string | null,
        readonly returnInfo: string | null,
        readonly link: string | null,
        readonly cgst: number | null,
        readonly sgst: number | null,
        readonly igst: number | null,
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
        readonly slots: ({
            readonly id: string | null,
            readonly name: string | null,
            readonly value: string | null
        } | null)[] | null,
        readonly country: {
            readonly id: string,
            readonly name: string
        } | null,
        readonly sizeGroup: ({
            readonly _id: string | null,
            readonly slug: string | null,
            readonly size: {
                readonly name: string | null
            } | null
        } | null)[] | null,
        readonly colorGroup: ({
            readonly _id: string | null,
            readonly slug: string | null,
            readonly color: {
                readonly name: string | null,
                readonly color_code: string | null
            } | null
        } | null)[] | null,
        readonly brand: {
            readonly id: string,
            readonly name: string | null
        } | null,
        readonly parentBrand: {
            readonly id: string,
            readonly name: string | null
        } | null,
        readonly color: {
            readonly id: string,
            readonly name: string | null
        } | null,
        readonly size: {
            readonly id: string,
            readonly name: string | null
        } | null,
        readonly category: {
            readonly id: string,
            readonly name: string | null,
            readonly slug: string | null,
            readonly pathA: ({
                readonly name: string | null,
                readonly slug: string | null
            } | null)[] | null
        } | null,
        readonly categories: ({
            readonly id: string,
            readonly name: string | null
        })[] | null,
        readonly categoryPool: ({
            readonly id: string,
            readonly name: string | null
        })[] | null,
        readonly keyFeatures: (string | null)[] | null,
        readonly features: ({
            readonly id: string,
            readonly name: string | null,
            readonly value: string | null
        } | null)[] | null,
        readonly specifications: ({
            readonly id: string,
            readonly name: string | null,
            readonly value: string | null
        } | null)[] | null,
        readonly productDetails: ({
            readonly id: string,
            readonly name: string | null,
            readonly value: string | null
        } | null)[] | null,
        readonly channels: ({
            readonly id: string,
            readonly title: string | null,
            readonly img: string | null,
            readonly scheduleDateTime: number | null,
            readonly user: {
                readonly firstName: string | null,
                readonly lastName: string | null
            } | null
        } | null)[] | null,
        readonly collections: ({
            readonly id: string,
            readonly name: string | null,
            readonly description: string | null,
            readonly active: boolean | null,
            readonly images: (string | null)[] | null,
            readonly img: string | null,
            readonly q: string | null,
            readonly sort: string | null,
            readonly type: string | null
        } | null)[] | null,
        readonly options: ({
            readonly id: string | null,
            readonly name: string | null,
            readonly inputType: string | null,
            readonly required: boolean | null,
            readonly preselectDefault: boolean | null,
            readonly position: number | null,
            readonly values: ({
                readonly id: string,
                readonly name: string | null,
                readonly default: boolean | null,
                readonly position: number | null,
                readonly direction: string | null,
                readonly isPercent: boolean | null,
                readonly value: number | null
            } | null)[] | null
        } | null)[] | null,
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
        } | null,
        readonly relatedProducts: ({
            readonly id: string | null,
            readonly name: string | null,
            readonly slug: string | null,
            readonly img: string | null
        } | null)[] | null,
        readonly returnAllowed: boolean | null,
        readonly replaceAllowed: boolean | null,
        readonly returnValidityInDays: number | null,
        readonly replaceValidityInDays: number | null,
        readonly files: (string | null)[] | null,
        readonly unit: string | null,
        readonly dimensionUnit: string | null,
        readonly formattedMrp: string | null,
        readonly formattedPrice: string | null,
        readonly createdAt: string,
        readonly updatedAt: string
    } | null
};

export type product$afterLoad = {
    readonly "input": {
        readonly "product": product$input
    },
    readonly "data": {
        readonly "product": product$result
    }
};

export type product$input = {
    id: string,
    zip?: string | null | undefined,
    optionValues?: (string | null | undefined)[] | null | undefined
};