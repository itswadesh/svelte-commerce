export function deepEquals(objA, objB, map = new WeakMap()) {
    if (Object.is(objA, objB))
        return true;
    if (objA instanceof Date && objB instanceof Date) {
        return objA.getTime() === objB.getTime();
    }
    if (objA instanceof RegExp && objB instanceof RegExp) {
        return objA.toString() === objB.toString();
    }
    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false;
    }
    if (map.get(objA) === objB)
        return true;
    map.set(objA, objB);
    const keysA = Reflect.ownKeys(objA);
    const keysB = Reflect.ownKeys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }
    for (let i = 0; i < keysA.length; i++) {
        if (!Reflect.has(objB, keysA[i]) || !deepEquals(objA[keysA[i]], objB[keysA[i]], map)) {
            return false;
        }
    }
    return true;
}
