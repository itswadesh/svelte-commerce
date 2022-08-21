export type verifyEmail = {
    readonly "input": verifyEmail$input,
    readonly "result": verifyEmail$result
};

export type verifyEmail$result = {
    readonly verifyEmail: boolean | null
};

export type verifyEmail$input = {
    id: string,
    token: string,
    expires: string,
    signature: string,
    store?: string | null | undefined
};