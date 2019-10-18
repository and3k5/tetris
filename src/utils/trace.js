var _debug = false;
var _info = false;
var _log = true;
var _warn = true;
var _error = true;

if (global.development === true) {
    _debug = true;
    _info = true;
}

export function debug(...args) {
    if (_debug !== true)
        return;
    console.debug.apply(console, args);
}

export function info(...args) {
    if (_info !== true)
        return;
    console.info.apply(console, args);
}

export function log(...args) {
    if (_log !== true)
        return;
    console.log.apply(console, args);
}

export function warn(...args) {
    if (_warn !== true)
        return;
    console.warn.apply(console, args);
}

export function error(...args) {
    if (_error !== true)
        return;
    console.error.apply(console, args);
}
