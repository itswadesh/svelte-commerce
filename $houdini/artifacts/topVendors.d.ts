export type topVendors = {
    readonly "input": topVendors$input,
    readonly "result": topVendors$result | undefined
};

export type topVendors$result = {
    readonly topVendors: ({
        readonly id: string | null,
        readonly businessName: string | null,
        readonly productSold: number | null,
        readonly banner: string | null,
        readonly bannerCdn: string | null
    } | null)[] | null
};

export type topVendors$afterLoad = {
    readonly "input": {
        readonly "topVendors": topVendors$input
    },
    readonly "data": {
        readonly "topVendors": topVendors$result
    }
};

export type topVendors$input = {
    limit?: number | null | undefined
};