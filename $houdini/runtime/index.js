export * from './lib';
export * from './inline';
export * from './adapter';
// this template tag gets removed by the preprocessor so it should never be invoked.
// this function needs to return the same value as what the preprocessor leaves behind for type consistency
export function graphql(str) {
    // if this is executed, the preprocessor is not enabled
    throw new Error("Looks like you don't have the preprocessor enabled.");
}
