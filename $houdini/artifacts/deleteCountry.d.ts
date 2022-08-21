export type deleteCountry = {
    readonly "input": deleteCountry$input,
    readonly "result": deleteCountry$result
};

export type deleteCountry$result = {
    readonly deleteCountry: boolean | null
};

export type deleteCountry$input = {
    id: string
};