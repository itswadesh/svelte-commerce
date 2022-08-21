export type me = {
    readonly "input": null,
    readonly "result": me$result | undefined
};

export type me$result = {
    readonly me: {
        readonly id: string | null,
        readonly firstName: string | null,
        readonly lastName: string | null,
        readonly email: string | null,
        readonly phone: string | null,
        readonly gender: string | null,
        readonly role: string | null,
        readonly verified: boolean | null,
        readonly active: boolean | null,
        readonly provider: string | null,
        readonly avatar: string | null,
        readonly avatarCdn: string | null,
        readonly referralCode: string | null,
        readonly currentBalance: number | null,
        readonly store: string | null
    } | null
};

export type me$afterLoad = {
    readonly "data": {
        readonly "me": me$result
    }
};