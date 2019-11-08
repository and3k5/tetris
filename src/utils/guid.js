const crypto = crypto || require("crypto");

function getRandomValues(arr) {
    if (typeof(crypto.getRandomValues) === "function") {
        return crypto.getRandomValues(arr);
    }else if (typeof(crypto.randomFillSync) === "function") {
        return crypto.randomFillSync(arr);
    }else{
        throw new Error("crypto is lacking a method");
    }
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

var usedGuids = [];

export function createGuid() {
    const guid = uuidv4();
    if (usedGuids.indexOf(guid) === -1)
        usedGuids.push(usedGuids);
    return guid;
}

export function createUniqueGuid() {
    let guid;
    do {
        guid = uuidv4();
    } while (usedGuids.indexOf(guid) !== -1);
    usedGuids.push(guid);
    return guid;
}