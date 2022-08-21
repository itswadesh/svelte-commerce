export type myAddresses = {
    readonly "input": myAddresses$input,
    readonly "result": myAddresses$result | undefined
};

export type myAddresses$result = {
    readonly myAddresses: {
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
            readonly updatedAt: string
        } | null)[] | null
    } | null
};

export type myAddresses$afterLoad = {
    readonly "input": {
        readonly "myAddresses": myAddresses$input
    },
    readonly "data": {
        readonly "myAddresses": myAddresses$result
    }
};

export type myAddresses$input = {
    page?: number | null | undefined,
    search?: string | null | undefined,
    limit?: number | null | undefined,
    sort?: string | null | undefined
};