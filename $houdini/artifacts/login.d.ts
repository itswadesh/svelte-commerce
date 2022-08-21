export type login = {
    readonly "input": login$input,
    readonly "result": login$result
};

export type login$result = {
    readonly login: {
        readonly id: string | null,
        readonly email: string | null,
        readonly firstName: string | null,
        readonly lastName: string | null,
        readonly city: string | null,
        readonly phone: string | null,
        readonly avatar: string | null,
        readonly avatarCdn: string | null,
        readonly role: string | null,
        readonly verified: boolean | null,
        readonly active: boolean | null,
        readonly provider: string | null,
        readonly store: {
            readonly name: string | null
        } | null,
        readonly vendor: string | null,
        readonly plan: string | null,
        readonly createdAt: string | null,
        readonly updatedAt: string | null
    } | null
};

export type login$input = {
    email: string,
    password: string
};