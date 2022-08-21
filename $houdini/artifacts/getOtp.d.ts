export type getOtp = {
    readonly "input": getOtp$input,
    readonly "result": getOtp$result
};

export type getOtp$result = {
    readonly getOtp: {
        readonly otp: string | null,
        readonly timer: number | null
    } | null
};

export type getOtp$input = {
    phone: string,
    role?: string | null | undefined,
    store?: string | null | undefined
};