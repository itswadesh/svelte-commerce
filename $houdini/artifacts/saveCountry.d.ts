export type saveCountry = {
    readonly "input": saveCountry$input,
    readonly "result": saveCountry$result
};

export type saveCountry$result = {
    readonly saveCountry: {
        readonly id: string,
        readonly name: string,
        readonly value: string | null,
        readonly dialCode: string | null,
        readonly code: string | null,
        readonly img: string | null,
        readonly imgCdn: string | null,
        readonly flag: string | null,
        readonly lang: string | null,
        readonly states: ({
            readonly name: string
        } | null)[] | null,
        readonly sort: number | null,
        readonly active: boolean | null,
        readonly createdAt: string,
        readonly updatedAt: string
    } | null
};

export type saveCountry$input = {
    id?: string | null | undefined,
    name?: string | null | undefined,
    value?: string | null | undefined,
    dialCode?: string | null | undefined,
    code?: string | null | undefined,
    img?: string | null | undefined,
    flag?: string | null | undefined,
    lang?: string | null | undefined,
    sort?: number | null | undefined,
    active?: boolean | null | undefined
};