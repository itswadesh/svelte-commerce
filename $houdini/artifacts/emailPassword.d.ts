export type emailPassword = {
    readonly "input": emailPassword$input,
    readonly "result": emailPassword$result
};

export type emailPassword$result = {
    readonly emailPassword: string | null
};

export type emailPassword$input = {
    email: string,
    referrer: string
};