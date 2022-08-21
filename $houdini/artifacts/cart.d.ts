export type cart = {
    readonly "input": cart$input,
    readonly "result": cart$result | undefined
};

export type cart$result = {
    readonly cart: {
        readonly id: string | null,
        readonly storeCurrency: string | null,
        readonly currencyCode: string | null,
        readonly currencyName: string | null,
        readonly currencySymbol: string | null,
        readonly needAddress: boolean | null,
        readonly items: ({
            readonly pid: string | null,
            readonly barcode: string | null,
            readonly tax: number | null,
            readonly name: string | null,
            readonly type: string | null,
            readonly slug: string | null,
            readonly qty: number | null,
            readonly price: number | null,
            readonly mrp: number | null,
            readonly shippingCharge: number | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly tracking: string | null,
            readonly brandName: string | null,
            readonly vendor: string | null,
            readonly vendorSlug: string | null,
            readonly vendorBusinessName: string | null,
            readonly deliveryDetails: string | null,
            readonly foodType: string | null,
            readonly usedOptions: ({
                readonly name: string | null,
                readonly val: (string | null)[] | null,
                readonly dates: (string | null)[] | null
            } | null)[] | null,
            readonly options: ({
                readonly option: string | null,
                readonly values: (string | null)[] | null
            } | null)[] | null,
            readonly formattedItemAmount: {
                readonly mrp: string | null,
                readonly price: string | null,
                readonly tax: string | null,
                readonly shippingCharge: string | null
            } | null
        } | null)[] | null,
        readonly qty: number | null,
        readonly tax: number | null,
        readonly subtotal: number | null,
        readonly total: number | null,
        readonly discount: {
            readonly code: string | null,
            readonly value: number | null,
            readonly text: string | null,
            readonly amount: number | null
        } | null,
        readonly shipping: {
            readonly charge: number | null
        } | null,
        readonly formattedAmount: {
            readonly offer_total: string | null,
            readonly tax: string | null,
            readonly subtotal: string | null,
            readonly total: string | null
        } | null,
        readonly unavailableItems: ({
            readonly status: string | null,
            readonly msg: string | null,
            readonly pid: string | null,
            readonly barcode: string | null,
            readonly tax: number | null,
            readonly name: string | null,
            readonly type: string | null,
            readonly slug: string | null,
            readonly qty: number | null,
            readonly price: number | null,
            readonly mrp: number | null,
            readonly shippingCharge: number | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly tracking: string | null,
            readonly brandName: string | null,
            readonly vendor: string | null,
            readonly vendorSlug: string | null,
            readonly vendorBusinessName: string | null,
            readonly deliveryDetails: string | null,
            readonly foodType: string | null,
            readonly usedOptions: ({
                readonly name: string | null,
                readonly val: (string | null)[] | null,
                readonly dates: (string | null)[] | null
            } | null)[] | null,
            readonly options: ({
                readonly option: string | null,
                readonly values: (string | null)[] | null
            } | null)[] | null
        } | null)[] | null
    } | null
};

export type cart$afterLoad = {
    readonly "input": {
        readonly "cart": cart$input
    },
    readonly "data": {
        readonly "cart": cart$result
    }
};

export type cart$input = {
    store?: string | null | undefined
};