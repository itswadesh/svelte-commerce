export type checkWishlist = {
    readonly "input": checkWishlist$input,
    readonly "result": checkWishlist$result | undefined
};

export type checkWishlist$result = {
    readonly checkWishlist: boolean | null
};

export type checkWishlist$afterLoad = {
    readonly "input": {
        readonly "checkWishlist": checkWishlist$input
    },
    readonly "data": {
        readonly "checkWishlist": checkWishlist$result
    }
};

export type checkWishlist$input = {
    product: string,
    variant: string
};