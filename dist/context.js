"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (def) {
    var state = def;
    return {
        get: function (k) { return state[k]; },
        set: function (k, v) { return state[k] = v; },
        reset: function () { state = def(); },
        dump: function () { return console.log('\n\nContext\n---------\n\n', state); }
    };
};
