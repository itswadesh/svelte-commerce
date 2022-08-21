export function errorsToGraphQLLayout(errors) {
    if (Array.isArray(errors)) {
        return errors.map((error) => {
            return { message: error };
        });
    }
    return [{ message: errors }];
}
