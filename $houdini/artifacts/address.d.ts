export type address = {
    readonly "input": address$input,
    readonly "result": address$result | undefined
};

export type address$result = {
    readonly address: {
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
    } | null
};

export type address$afterLoad = {
    readonly "input": {
        readonly "address": address$input
    },
    readonly "data": {
        readonly "address": address$result
    }
};

export type address$input = {
    id: string
};