import { flattenList } from './stuff';
// NOTE: the current implementation of delete is slow. it should try to compare the
// type of the id being deleted with the type contained in the linked list so that
// the removal logic is only performed when its possible the ID is found inside.
// ie: deleting a user should not slow down looking up a list of cats
export class InMemoryStorage {
    constructor() {
        this.idCount = 0;
        this.rank = 0;
        this.data = [];
    }
    get layerCount() {
        return this.data.length;
    }
    get nextRank() {
        return this.rank++;
    }
    // create a layer and return its id
    createLayer(optimistic = false) {
        // generate the next layer
        const layer = new Layer(this.idCount++);
        layer.optimistic = optimistic;
        // add the layer to the list
        this.data.push(layer);
        // pass the layer on so it can be updated
        return layer;
    }
    insert(id, field, location, target) {
        return this.topLayer.insert(id, field, location, target);
    }
    remove(id, field, target) {
        return this.topLayer.remove(id, field, target);
    }
    delete(id) {
        return this.topLayer.delete(id);
    }
    deleteField(id, field) {
        return this.topLayer.deleteField(id, field);
    }
    getLayer(id) {
        for (const layer of this.data) {
            if (layer.id === id) {
                return layer;
            }
        }
        // we didn't find the layer
        throw new Error('Could not find layer with id: ' + id);
    }
    replaceID(replacement) {
        for (const layer of this.data) {
            layer.replaceID(replacement);
        }
    }
    get(id, field) {
        // the list of operations for the field
        const operations = {
            [OperationKind.insert]: {
                [OperationLocation.start]: [],
                [OperationLocation.end]: [],
            },
            [OperationKind.remove]: new Set(),
        };
        // the list of layers we used to build up the value
        const layerIDs = [];
        // go through the list of layers in reverse
        for (let i = this.data.length - 1; i >= 0; i--) {
            const layer = this.data[i];
            const [layerValue, kind] = layer.get(id, field);
            const layerOperations = layer.getOperations(id, field) || [];
            layer.deletedIDs.forEach((v) => {
                var _a, _b;
                // if the layer wants to undo a delete for the id
                if ((_b = (_a = layer.operations[v]) === null || _a === void 0 ? void 0 : _a.undoDeletesInList) === null || _b === void 0 ? void 0 : _b.includes(field)) {
                    return;
                }
                operations.remove.add(v);
            });
            // if the layer does not contain a value for the field, move on
            if (typeof layerValue === 'undefined' && layerOperations.length === 0) {
                if (layer.deletedIDs.size > 0) {
                    layerIDs.push(layer.id);
                }
                continue;
            }
            // if the result isn't an array we can just use the value since we can't
            // apply operations to the field
            if (typeof layerValue !== 'undefined' && !Array.isArray(layerValue)) {
                return {
                    value: layerValue,
                    kind,
                    displayLayers: [layer.id],
                };
            }
            // if the layer contains operations or values add it to the list of relevant layers
            // add the layer to the list
            layerIDs.push(layer.id);
            // if we have an operation
            if (layerOperations.length > 0) {
                // process every operation
                for (const op of layerOperations) {
                    // remove operation
                    if (isRemoveOperation(op)) {
                        operations.remove.add(op.id);
                    }
                    // inserts are sorted by location
                    if (isInsertOperation(op)) {
                        operations.insert[op.location].unshift(op.id);
                    }
                    // if we found a delete operation, we're done
                    if (isDeleteOperation(op)) {
                        return {
                            value: undefined,
                            kind: 'unknown',
                            displayLayers: [],
                        };
                    }
                }
            }
            // if we don't have a value to return, we're done
            if (typeof layerValue === 'undefined') {
                continue;
            }
            // if there are no operations, move along
            if (!operations.remove.size &&
                !operations.insert.start.length &&
                !operations.insert.end.length) {
                return { value: layerValue, displayLayers: layerIDs, kind: 'link' };
            }
            // we have operations to apply to the list
            return {
                value: [...operations.insert.start, ...layerValue, ...operations.insert.end].filter((value) => !operations.remove.has(value)),
                displayLayers: layerIDs,
                kind,
            };
        }
        return {
            value: undefined,
            kind: 'unknown',
            displayLayers: [],
        };
    }
    writeLink(id, field, value) {
        // write to the top most layer
        return this.topLayer.writeLink(id, field, value);
    }
    writeField(id, field, value) {
        return this.topLayer.writeField(id, field, value);
    }
    resolveLayer(id) {
        let startingIndex = null;
        // find the layer with the matching id
        for (const [index, layer] of this.data.entries()) {
            if (layer.id !== id) {
                continue;
            }
            // we found the target layer
            startingIndex = index - 1;
            // its not optimistic any more
            this.data[index].optimistic = false;
            // we're done
            break;
        }
        // if we didn't find the layer, yell loudly
        if (startingIndex === null) {
            throw new Error('could not find layer with id: ' + id);
        }
        // if we are resolving the base layer make sure we start at zero
        if (startingIndex === -1) {
            startingIndex = 0;
        }
        // if the starting layer is optimistic then we can't write to it
        if (this.data[startingIndex].optimistic) {
            startingIndex++;
        }
        // start walking down the list of layers, applying any non-optimistic ones to the target
        const baseLayer = this.data[startingIndex];
        let layerIndex = startingIndex;
        while (layerIndex < this.data.length) {
            // the layer in question and move the counter up one after we index
            const layer = this.data[layerIndex++];
            // if the layer is optimistic, we can't go further
            if (layer.optimistic) {
                layerIndex--;
                break;
            }
            // apply the layer onto our base
            baseLayer.writeLayer(layer);
        }
        // delete the layers we merged
        this.data.splice(startingIndex + 1, layerIndex - startingIndex - 1);
    }
    get topLayer() {
        var _a;
        // if there is no base layer
        if (this.data.length === 0) {
            this.createLayer();
        }
        // if the last layer is optimistic, create another layer on top of it
        // since optimistic layers have to be written to directly
        if ((_a = this.data[this.data.length - 1]) === null || _a === void 0 ? void 0 : _a.optimistic) {
            this.createLayer();
        }
        // the top layer is safe to write to (its non-null and guaranteed not optimistic)
        return this.data[this.data.length - 1];
    }
}
export class Layer {
    constructor(id) {
        this.optimistic = false;
        this.fields = {};
        this.links = {};
        this.operations = {};
        this.deletedIDs = new Set();
        this.id = id;
    }
    get(id, field) {
        var _a, _b;
        // if its a link return the value
        if (typeof ((_a = this.links[id]) === null || _a === void 0 ? void 0 : _a[field]) !== 'undefined') {
            return [this.links[id][field], 'link'];
        }
        // only other option is a value
        return [(_b = this.fields[id]) === null || _b === void 0 ? void 0 : _b[field], 'scalar'];
    }
    getOperations(id, field) {
        var _a, _b, _c;
        // if the id has been deleted
        if ((_a = this.operations[id]) === null || _a === void 0 ? void 0 : _a.deleted) {
            return [
                {
                    kind: OperationKind.delete,
                    target: id,
                },
            ];
        }
        // there could be a mutation for the specific field
        if ((_c = (_b = this.operations[id]) === null || _b === void 0 ? void 0 : _b.fields) === null || _c === void 0 ? void 0 : _c[field]) {
            return this.operations[id].fields[field];
        }
    }
    writeField(id, field, value) {
        this.fields[id] = {
            ...this.fields[id],
            [field]: value,
        };
        return this.id;
    }
    writeLink(id, field, value) {
        var _a, _b, _c;
        // if any of the values in this link are flagged to be deleted, undelete it
        const valueList = Array.isArray(value) ? value : [value];
        for (const value of flattenList(valueList)) {
            if (!value) {
                continue;
            }
            const fieldOperations = (_a = this.operations[id]) === null || _a === void 0 ? void 0 : _a.fields[field];
            // if the operation was globally deleted
            if (((_b = this.operations[value]) === null || _b === void 0 ? void 0 : _b.deleted) || this.deletedIDs.has(value)) {
                // undo the delete
                this.operations[value] = {
                    ...this.operations[value],
                    undoDeletesInList: [...(((_c = this.operations[id]) === null || _c === void 0 ? void 0 : _c.undoDeletesInList) || []), field],
                };
                // the value could have been removed specifically from the list
            }
            else if (value && (fieldOperations === null || fieldOperations === void 0 ? void 0 : fieldOperations.length) > 0) {
                // if we have a field operation to remove the list, undo the operation
                this.operations[id].fields[field] = fieldOperations.filter((op) => op.kind !== 'remove' || op.id !== value);
            }
        }
        this.links[id] = {
            ...this.links[id],
            [field]: value,
        };
        return this.id;
    }
    isDisplayLayer(displayLayers) {
        return (displayLayers.length === 0 ||
            displayLayers.includes(this.id) ||
            Math.max(...displayLayers) < this.id);
    }
    clear() {
        // before we clear the data of the layer, look for any subscribers that need to be updated
        // now that everything has been notified we can reset the data
        this.links = {};
        this.fields = {};
        this.operations = {};
        this.deletedIDs = new Set();
    }
    replaceID({ from, to }) {
        // any fields that existing in from, assign to to
        this.fields[to] = this.fields[from];
        this.links[to] = this.links[from];
        this.operations[to] = this.operations[from] || { fields: {} };
        if (this.deletedIDs.has(from)) {
            this.deletedIDs.add(to);
        }
    }
    removeUndefinedFields() {
        // any field that's marked as undefined needs to be deleted
        for (const [id, fields] of Object.entries(this.fields)) {
            for (const [field, value] of Object.entries(fields)) {
                if (typeof value === 'undefined') {
                    try {
                        delete this.fields[id][field];
                    }
                    catch { }
                    try {
                        delete this.links[id][field];
                    }
                    catch { }
                }
            }
            // if there are no fields left for the object, clean it up
            if (Object.keys(fields || {}).length === 0) {
                delete this.fields[id];
            }
            // if there are no more links, clean it up
            if (Object.keys(this.links[id] || {}).length === 0) {
                delete this.links[id];
            }
        }
    }
    delete(id) {
        // add an insert operation to the map
        this.operations = {
            ...this.operations,
            [id]: {
                ...this.operations[id],
                deleted: true,
                // reapply any delete undos
                undoDeletesInList: [],
            },
        };
        // add the id to the list of ids that have been deleted in this layer (so we can filter them out later)
        this.deletedIDs.add(id);
    }
    deleteField(id, field) {
        this.fields[id] = {
            ...this.fields[id],
            [field]: undefined,
        };
    }
    insert(id, field, where, target) {
        // add an insert operation for the field
        this.addFieldOperation(id, field, {
            kind: OperationKind.insert,
            id: target,
            location: where,
        });
    }
    remove(id, field, target) {
        // add a remove operation for the field
        this.addFieldOperation(id, field, {
            kind: OperationKind.remove,
            id: target,
        });
    }
    writeLayer(layer) {
        // if we are merging into ourselves, we're done
        if (layer.id === this.id) {
            return;
        }
        // we have to apply operations before we move fields so we can clean up existing
        // data if we have a delete before we copy over the values
        for (const [id, ops] of Object.entries(layer.operations)) {
            const fields = {};
            // merge the two operation maps
            for (const opMap of [this.operations[id], layer.operations[id]].filter(Boolean)) {
                for (const [fieldName, operations] of Object.entries(opMap.fields || {})) {
                    fields[fieldName] = [...(fields[fieldName] || []), ...operations];
                }
            }
            // only copy a field key if there is something
            if (Object.keys(fields).length > 0) {
                this.operations[id] = {
                    ...this.operations[id],
                    fields,
                };
            }
            // if we are applying
            if (ops === null || ops === void 0 ? void 0 : ops.deleted) {
                delete this.fields[id];
                delete this.links[id];
            }
        }
        // copy the field values
        for (const [id, values] of Object.entries(layer.fields)) {
            if (!values) {
                continue;
            }
            // we do have a record matching this id, copy the individual fields
            for (const [field, value] of Object.entries(values)) {
                this.writeField(id, field, value);
            }
        }
        // copy the link values
        for (const [id, values] of Object.entries(layer.links)) {
            if (!values) {
                continue;
            }
            // we do have a record matching this id, copy the individual links
            for (const [field, value] of Object.entries(values)) {
                this.writeLink(id, field, value);
            }
        }
        // add the list of deleted ids to this layer
        layer.deletedIDs.forEach((v) => this.deletedIDs.add(v));
    }
    addFieldOperation(id, field, operation) {
        var _a;
        this.operations = {
            ...this.operations,
            [id]: {
                ...this.operations[id],
                fields: {
                    [field]: [...(((_a = this.operations[id]) === null || _a === void 0 ? void 0 : _a.fields[field]) || []), operation],
                },
            },
        };
    }
}
function isDeleteOperation(value) {
    return !!value && value.kind === OperationKind.delete;
}
function isInsertOperation(value) {
    return !!value && value.kind === OperationKind.insert;
}
function isRemoveOperation(value) {
    return !!value && value.kind === OperationKind.remove;
}
export var OperationLocation;
(function (OperationLocation) {
    OperationLocation["start"] = "start";
    OperationLocation["end"] = "end";
})(OperationLocation || (OperationLocation = {}));
export var OperationKind;
(function (OperationKind) {
    OperationKind["delete"] = "delete";
    OperationKind["insert"] = "insert";
    OperationKind["remove"] = "remove";
})(OperationKind || (OperationKind = {}));
