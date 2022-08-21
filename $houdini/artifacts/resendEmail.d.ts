export type resendEmail = {
    readonly "input": resendEmail$input,
    readonly "result": resendEmail$result
};

export type resendEmail$result = {
    readonly resendEmail: string | null
};

export type resendEmail$input = {
    email?: string | null | undefined
};