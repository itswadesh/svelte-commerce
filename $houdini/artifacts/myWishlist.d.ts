export type myWishlist = {
    readonly "input": myWishlist$input,
    readonly "result": myWishlist$result | undefined
};

export type myWishlist$result = {
    readonly myWishlist: {
        readonly count: number | null,
        readonly page: number | null,
        readonly pageSize: number | null,
        readonly data: ({
            readonly id: string | null,
            readonly active: boolean | null,
            readonly createdAt: string | null,
            readonly updatedAt: string | null,
            readonly product: {
                readonly id: string | null,
                readonly name: string | null,
                readonly slug: string | null,
                readonly img: string | null,
                readonly price: number | null,
                readonly mrp: number | null,
                readonly formattedPrice: string | null,
                readonly discount: number | null,
                readonly foodType: string | null,
                readonly vendor: {
                    readonly id: string | null,
                    readonly slug: string | null,
                    readonly businessName: string | null,
                    readonly banner: string | null,
                    readonly bannerCdn: string | null
                } | null,
                readonly brand: {
                    readonly id: string,
                    readonly name: string | null,
                    readonly img: string | null
                } | null
            } | null,
            readonly variant: {
                readonly id: string | null,
                readonly name: string | null
            } | null,
            readonly user: {
                readonly id: string | null,
                readonly firstName: string | null,
                readonly lastName: string | null
            } | null,
            readonly store: {
                readonly id: string,
                readonly name: string | null,
                readonly email: string | null
            } | null
        } | null)[] | null
    } | null
};

export type myWishlist$afterLoad = {
    readonly "input": {
        readonly "myWishlist": myWishlist$input
    },
    readonly "data": {
        readonly "myWishlist": myWishlist$result
    }
};

export type myWishlist$input = {
    page?: number | null | undefined,
    search?: string | null | undefined,
    limit?: number | null | undefined,
    sort?: string | null | undefined,
    store?: string | null | undefined
};