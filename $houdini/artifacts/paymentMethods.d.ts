export type paymentMethods = {
    readonly "input": paymentMethods$input,
    readonly "result": paymentMethods$result | undefined
};

export type paymentMethods$result = {
    readonly paymentMethods: {
        readonly count: number | null,
        readonly page: number | null,
        readonly pageSize: number | null,
        readonly data: ({
            readonly id: string,
            readonly name: string,
            readonly img: string | null,
            readonly imgCdn: string | null,
            readonly value: string | null,
            readonly color: string | null,
            readonly key: string | null,
            readonly text: string | null,
            readonly qrcode: string | null,
            readonly type: string | null,
            readonly instructions: string | null,
            readonly position: number | null,
            readonly active: boolean | null
        } | null)[] | null
    } | null
};

export type paymentMethods$afterLoad = {
    readonly "input": {
        readonly "paymentMethods": paymentMethods$input
    },
    readonly "data": {
        readonly "paymentMethods": paymentMethods$result
    }
};

export type paymentMethods$input = {
    page?: number | null | undefined,
    search?: string | null | undefined,
    limit?: number | null | undefined,
    sort?: string | null | undefined,
    store?: string | null | undefined,
    active?: boolean | null | undefined
};