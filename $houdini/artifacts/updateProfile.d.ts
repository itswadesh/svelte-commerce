export type updateProfile = {
    readonly "input": updateProfile$input,
    readonly "result": updateProfile$result
};

export type updateProfile$result = {
    readonly updateProfile: {
        readonly firstName: string | null,
        readonly lastName: string | null,
        readonly email: string | null,
        readonly phone: string | null,
        readonly avatar: string | null,
        readonly avatarCdn: string | null,
        readonly role: string | null,
        readonly gender: string | null,
        readonly city: string | null,
        readonly shippingCharges: number | null,
        readonly freeShippingOn: number | null,
        readonly storeName: string | null,
        readonly banner: string | null,
        readonly info: {
            readonly public: boolean | null,
            readonly store: string | null
        } | null
    } | null
};

type AddressInput = {
    id?: string | null | undefined,
    email?: string | null | undefined,
    firstName?: string | null | undefined,
    lastName?: string | null | undefined,
    address?: string | null | undefined,
    town?: string | null | undefined,
    city?: string | null | undefined,
    country?: string | null | undefined,
    district?: string | null | undefined,
    state?: string | null | undefined,
    lat?: number | null | undefined,
    lng?: number | null | undefined,
    zip?: number | null | undefined,
    phone?: string | null | undefined,
    active?: boolean | null | undefined
};

type InputInfo = {
    public?: boolean | null | undefined,
    store?: string | null | undefined,
    storePhotos?: (string | null | undefined)[] | null | undefined
};

export type updateProfile$input = {
    address?: AddressInput | null | undefined,
    firstName?: string | null | undefined,
    lastName?: string | null | undefined,
    email?: string | null | undefined,
    avatar?: string | null | undefined,
    dob?: string | null | undefined,
    gender?: string | null | undefined,
    phone?: string | null | undefined,
    info?: InputInfo | null | undefined,
    shippingCharges?: number | null | undefined,
    freeShippingOn?: number | null | undefined,
    storeName?: string | null | undefined,
    banner?: string | null | undefined
};