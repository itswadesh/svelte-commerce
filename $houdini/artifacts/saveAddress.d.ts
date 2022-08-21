export type saveAddress = {
    readonly "input": saveAddress$input,
    readonly "result": saveAddress$result
};

export type saveAddress$result = {
    readonly saveAddress: {
        readonly id: string,
        readonly firstName: string | null,
        readonly lastName: string | null,
        readonly address: string | null,
        readonly locality: string | null,
        readonly town: string | null,
        readonly district: string | null,
        readonly city: string | null,
        readonly type: string | null,
        readonly country: string | null,
        readonly state: string | null,
        readonly zip: string | null,
        readonly phone: string | null,
        readonly email: string | null,
        readonly lat: number | null,
        readonly lng: number | null,
        readonly isResidential: boolean | null,
        readonly store: string | null
    } | null
};

export type saveAddress$input = {
    id: string,
    firstName?: string | null | undefined,
    lastName?: string | null | undefined,
    type?: string | null | undefined,
    address?: string | null | undefined,
    locality?: string | null | undefined,
    town?: string | null | undefined,
    district?: string | null | undefined,
    city?: string | null | undefined,
    country?: string | null | undefined,
    state?: string | null | undefined,
    zip?: string | null | undefined,
    phone?: string | null | undefined,
    email?: string | null | undefined,
    lat?: number | null | undefined,
    lng?: number | null | undefined,
    store?: string | null | undefined,
    isResidential?: boolean | null | undefined
};