export type changePassword = {
    readonly "input": changePassword$input,
    readonly "result": changePassword$result
};

export type changePassword$result = {
    readonly changePassword: boolean | null
};

export type changePassword$input = {
    oldPassword: string,
    password: string,
    passwordConfirmation: string
};