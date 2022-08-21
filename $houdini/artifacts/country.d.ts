export type country = {
    readonly "input": country$input,
    readonly "result": country$result | undefined
};

export type country$result = {
    readonly country: {
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
        readonly active: boolean | null
    } | null
};

export type country$afterLoad = {
    readonly "input": {
        readonly "country": country$input
    },
    readonly "data": {
        readonly "country": country$result
    }
};

export type country$input = {
    id?: string | null | undefined
};