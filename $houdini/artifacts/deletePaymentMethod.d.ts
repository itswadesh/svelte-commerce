export type deletePaymentMethod = {
    readonly "input": deletePaymentMethod$input,
    readonly "result": deletePaymentMethod$result
};

export type deletePaymentMethod$result = {
    readonly deletePaymentMethod: boolean | null
};

export type deletePaymentMethod$input = {
    id: string
};