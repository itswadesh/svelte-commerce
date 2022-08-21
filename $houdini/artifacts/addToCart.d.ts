export type addToCart = {
    readonly "input": addToCart$input,
    readonly "result": addToCart$result
};

export type addToCart$result = {
    readonly addToCart: {
        readonly items: ({
            readonly pid: string | null,
            readonly vid: string | null,
            readonly barcode: string | null,
            readonly name: string | null,
            readonly type: string | null,
            readonly slug: string | null,
            readonly qty: number | null,
            readonly price: number | null,
            readonly shippingCharge: number | null,
            readonly tax: number | null,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly brandName: string | null,
            readonly vendor: string | null,
            readonly vendorSlug: string | null,
            readonly vendorBusinessName: string | null,
            readonly deliveryDetails: string | null,
            readonly options: ({
                readonly option: string | null,
                readonly values: (string | null)[] | null
            } | null)[] | null,
            readonly usedOptions: ({
                readonly name: string | null,
                readonly val: (string | null)[] | null,
                readonly dates: (string | null)[] | null
            } | null)[] | null
        } | null)[] | null,
        readonly needAddress: boolean | null,
        readonly qty: number | null,
        readonly subtotal: number | null,
        readonly discount: {
            readonly code: string | null,
            readonly value: number | null,
            readonly text: string | null,
            readonly amount: number | null
        } | null,
        readonly shipping: {
            readonly charge: number | null
        } | null,
        readonly tax: number | null,
        readonly total: number | null
    } | null
};

type OptionIp1 = {
    option?: string | null | undefined,
    values?: (string | null | undefined)[] | null | undefined
};

export type addToCart$input = {
    qty: number,
    pid: string,
    vid?: string | null | undefined,
    options?: (OptionIp1 | null | undefined)[] | null | undefined,
    vendor?: string | null | undefined,
    replace?: boolean | null | undefined
};