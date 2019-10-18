var _debug = false;
var _info = false;
var _log = true;
var _warn = true;
var _error = true;

if (global.development === true) {
    _debug = true;
    _info = true;
}

function Void() { }

export const debug = _debug === true ? console.debug : Void;
export const info = _info === true ? console.info : Void;
export const log = _log === true ? console.log : Void;
export const warn = _warn === true ? console.warn : Void;
export const error = _error === true ? console.error : Void;