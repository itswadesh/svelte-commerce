export type verifyOtp = {
    readonly "input": verifyOtp$input,
    readonly "result": verifyOtp$result
};

export type verifyOtp$result = {
    readonly verifyOtp: {
        readonly id: string | null,
        readonly firstName: string | null,
        readonly lastName: string | null,
        readonly email: string | null,
        readonly phone: string | null,
        readonly role: string | null,
        readonly verified: boolean | null,
        readonly active: boolean | null,
        readonly avatar: string | null,
        readonly avatarCdn: string | null,
        readonly sid: string | null
    } | null
};

export type verifyOtp$input = {
    phone: string,
    otp: string,
    store?: string | null | undefined
};