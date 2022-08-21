export type savePaymentMethod = {
    readonly "input": savePaymentMethod$input,
    readonly "result": savePaymentMethod$result
};

export type savePaymentMethod$result = {
    readonly savePaymentMethod: {
        readonly id: string,
        readonly name: string,
        readonly key: string | null,
        readonly color: string | null,
        readonly img: string | null,
        readonly qrcode: string | null,
        readonly type: string | null,
        readonly imgCdn: string | null,
        readonly text: string | null,
        readonly instructions: string | null,
        readonly value: string | null,
        readonly position: number | null,
        readonly active: boolean | null
    } | null
};

export type savePaymentMethod$input = {
    id: string,
    name?: string | null | undefined,
    value?: string | null | undefined,
    key?: string | null | undefined,
    color?: string | null | undefined,
    img?: string | null | undefined,
    qrcode?: string | null | undefined,
    type?: string | null | undefined,
    text?: string | null | undefined,
    instructions?: string | null | undefined,
    position?: number | null | undefined,
    active?: boolean | null | undefined
};