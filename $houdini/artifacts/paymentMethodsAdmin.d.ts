export type paymentMethodsAdmin = {
    readonly "input": paymentMethodsAdmin$input,
    readonly "result": paymentMethodsAdmin$result | undefined
};

export type paymentMethodsAdmin$result = {
    readonly paymentMethodsAdmin: {
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
            readonly active: boolean | null,
            readonly isError: boolean | null
        } | null)[] | null
    } | null
};

export type paymentMethodsAdmin$afterLoad = {
    readonly "input": {
        readonly "paymentMethodsAdmin": paymentMethodsAdmin$input
    },
    readonly "data": {
        readonly "paymentMethodsAdmin": paymentMethodsAdmin$result
    }
};

export type paymentMethodsAdmin$input = {
    page?: number | null | undefined,
    search?: string | null | undefined,
    limit?: number | null | undefined,
    sort?: string | null | undefined,
    active?: boolean | null | undefined,
    store?: string | null | undefined
};