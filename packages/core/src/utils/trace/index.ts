let _debug = false;
let _info = false;
let _log = true;
let _warn = true;
let _error = true;

if (global.development === true) {
    _debug = true;
    _info = true;
}

if (global.node === true) {
    _debug = false;
    _info = false;
    _log = false;
    _warn = false;
    _error = false;
}

function Void() { }

export const debug = _debug === true ? console.debug : Void;
export const info = _info === true ? console.info : Void;
export const log = _log === true ? console.log : Void;
export const warn = _warn === true ? console.warn : Void;
export const error = _error === true ? console.error : Void;
export const count = console.count;