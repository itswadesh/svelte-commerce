export type stripe = {
    readonly "input": stripe$input,
    readonly "result": stripe$result
};

export type stripe$result = {
    readonly stripe: {
        readonly id: string | null,
        readonly paymentOrderId: string | null,
        readonly paymentMode: string | null,
        readonly paymentGateway: string | null,
        readonly referenceId: string | null,
        readonly txMsg: string | null,
        readonly txTime: string | null,
        readonly invoiceId: string | null,
        readonly receipt: string | null,
        readonly paid: boolean | null,
        readonly amountPaid: number | null,
        readonly amountDue: number | null,
        readonly amountRefunded: number | null,
        readonly currency: string | null,
        readonly captured: boolean | null,
        readonly status: string | null,
        readonly orderId: string | null,
        readonly notes: string | null,
        readonly refundStatus: string | null,
        readonly description: string | null,
        readonly email: string | null,
        readonly contact: string | null,
        readonly fee: number | null,
        readonly tax: number | null,
        readonly errorCode: string | null,
        readonly errorDescription: string | null,
        readonly token: string | null,
        readonly clientSecret: string | null,
        readonly approvalUrl: string | null
    } | null
};

export type stripe$input = {
    address?: string | null | undefined,
    paymentMethodId?: string | null | undefined,
    slot?: string | null | undefined
};