export function defaultConfigValues(file) {
    return {
        defaultKeys: ['id'],
        ...file,
        types: {
            Node: {
                keys: ['id'],
                resolve: {
                    queryField: 'node',
                    arguments: (node) => ({ id: node.id }),
                },
            },
            ...file.types,
        },
    };
}
export function keyFieldsForType(configFile, type) {
    var _a, _b;
    return ((_b = (_a = configFile.types) === null || _a === void 0 ? void 0 : _a[type]) === null || _b === void 0 ? void 0 : _b.keys) || configFile.defaultKeys;
}
export function computeID(configFile, type, data) {
    const fields = keyFieldsForType(configFile, type);
    let id = '';
    for (const field of fields) {
        id += data[field] + '__';
    }
    return id.slice(0, -2);
}
