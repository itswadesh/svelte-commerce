export class GarbageCollector {
    constructor(cache, bufferSize = 10) {
        this.lifetimes = new Map();
        this.cache = cache;
        this.cacheBufferSize = bufferSize;
    }
    resetLifetime(id, field) {
        // if this is the first time we've seen the id
        if (!this.lifetimes.get(id)) {
            this.lifetimes.set(id, new Map());
        }
        // set the count to 0
        this.lifetimes.get(id).set(field, 0);
    }
    tick() {
        // look at every field of every record we know about
        for (const [id, fieldMap] of this.lifetimes.entries()) {
            for (const [field, lifetime] of fieldMap.entries()) {
                // if there is an active subscriber for the field move on
                if (this.cache._internal_unstable.subscriptions.get(id, field).length > 0) {
                    continue;
                }
                // there are no active subscriptions for this field, increment the lifetime count
                fieldMap.set(field, lifetime + 1);
                // if the lifetime is older than the maximum value, delete the value
                if (fieldMap.get(field) > this.cacheBufferSize) {
                    this.cache._internal_unstable.storage.deleteField(id, field);
                    // if there is a list associated with this field, the handler needs to be deleted
                    this.cache._internal_unstable.lists.deleteField(id, field);
                    // delete the entry in lifetime map
                    fieldMap.delete(field);
                    // if there are no more entries for the id, delete the id info
                    if ([...fieldMap.keys()].length === 0) {
                        this.lifetimes.delete(id);
                    }
                }
            }
        }
    }
}
