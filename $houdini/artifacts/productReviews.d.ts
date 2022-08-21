export type productReviews = {
    readonly "input": productReviews$input,
    readonly "result": productReviews$result | undefined
};

export type productReviews$result = {
    readonly productReviews: {
        readonly count: number | null,
        readonly page: number | null,
        readonly pageSize: number | null,
        readonly data: ({
            readonly id: string,
            readonly rating: number | null,
            readonly message: string | null,
            readonly user: {
                readonly firstName: string | null,
                readonly lastName: string | null,
                readonly avatar: string | null
            } | null,
            readonly active: boolean | null
        } | null)[] | null
    } | null
};

export type productReviews$afterLoad = {
    readonly "input": {
        readonly "productReviews": productReviews$input
    },
    readonly "data": {
        readonly "productReviews": productReviews$result
    }
};

export type productReviews$input = {
    page?: number | null | undefined,
    search?: string | null | undefined,
    limit?: number | null | undefined,
    pid: string,
    active?: boolean | null | undefined
};