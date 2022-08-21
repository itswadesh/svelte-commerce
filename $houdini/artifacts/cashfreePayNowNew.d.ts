export type cashfreePayNowNew = {
    readonly "input": cashfreePayNowNew$input,
    readonly "result": cashfreePayNowNew$result
};

export type cashfreePayNowNew$result = {
    readonly cashfreePayNowNew: {
        readonly orderId: string | null,
        readonly token: string | null,
        readonly redirectUrl: string | null
    } | null
};

export type cashfreePayNowNew$input = {
    address?: string | null | undefined,
    slot?: string | null | undefined
};