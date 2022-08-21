export type deleteAddress = {
    readonly "input": deleteAddress$input,
    readonly "result": deleteAddress$result
};

export type deleteAddress$result = {
    readonly deleteAddress: boolean | null
};

export type deleteAddress$input = {
    id: string
};