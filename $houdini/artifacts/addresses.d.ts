export type addresses = {
    readonly "input": addresses$input,
    readonly "result": addresses$result | undefined
};

export type addresses$result = {
    readonly addresses: {
        readonly count: number | null,
        readonly page: number | null,
        readonly pageSize: number | null,
        readonly data: ({
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
            readonly lng: number | null,
            readonly active: boolean | null,
            readonly verified: boolean | null,
            readonly createdAt: string,
            readonly updatedAt: string,
            readonly store: string | null
        } | null)[] | null
    } | null
};

export type addresses$afterLoad = {
    readonly "input": {
        readonly "addresses": addresses$input
    },
    readonly "data": {
        readonly "addresses": addresses$result
    }
};

export type addresses$input = {
    page?: number | null | undefined,
    search?: string | null | undefined,
    limit?: number | null | undefined,
    sort?: string | null | undefined,
    store?: string | null | undefined
};