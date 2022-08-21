export type paymentMethod = {
    readonly "input": paymentMethod$input,
    readonly "result": paymentMethod$result | undefined
};

export type paymentMethod$result = {
    readonly paymentMethod: {
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
    } | null
};

export type paymentMethod$afterLoad = {
    readonly "input": {
        readonly "paymentMethod": paymentMethod$input
    },
    readonly "data": {
        readonly "paymentMethod": paymentMethod$result
    }
};

export type paymentMethod$input = {
    id: string
};