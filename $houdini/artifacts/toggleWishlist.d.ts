export type toggleWishlist = {
    readonly "input": toggleWishlist$input,
    readonly "result": toggleWishlist$result
};

export type toggleWishlist$result = {
    readonly toggleWishlist: boolean | null
};

export type toggleWishlist$input = {
    product: string,
    variant: string
};