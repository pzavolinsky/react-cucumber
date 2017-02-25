"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOk = function (v) {
    return v.rest !== undefined;
};
exports.isError = function (v) {
    return v.msg !== undefined;
};
exports.either = function (v) { return exports.isOk(v)
    ? v
    : v.msg; };
var ok = function (add) { return function (value, rest) { return ({
    value: value,
    rest: rest,
    map: function (fn) { return ok(add)(fn(value), rest); },
    then: function (fn) { return fn(rest).map(function (v) { return add(value, v); }); }
}); }; };
exports.error = function (msg) { return ({
    map: function (_) { return exports.error(msg); },
    then: function (_) { return exports.error(msg); },
    msg: msg
}); };
var okString = ok(function (a, b) { return a + b; });
var okAttrs = ok(function (a, b) { return a.concat(b); });
// ---
var splitAt = function (s, n) { return okString(s.substring(0, n), s.substring(n + 1)); };
var wrap = function (start, end) { return function (v) { return start + v + end; }; };
exports.parseString = function (delim, input) {
    var end = input.indexOf(delim);
    if (end === -1)
        return exports.error("Incomplete string: " + input);
    var p = splitAt(input, end);
    return p.value.replace(/\\\\/g, '').match(/\\$/)
        ? p.then(function (r) { return exports.parseString(delim, r).map(function (v) { return delim + v; }); }) // \delim
        : p;
};
exports.parseBlock = function (input) {
    var end = input.match(/[{}"']/);
    if (!end || end.index === undefined) {
        return exports.error("Incomplete block: " + input);
    }
    var p = splitAt(input, end.index);
    var c = end[0];
    switch (c) {
        case '}':
            return p;
        case '"':
        case "'":
            return p
                .then(function (v) { return exports.parseString(c, v).map(wrap(c, c)); })
                .then(exports.parseBlock);
        default:
            return p
                .then(function (v) { return exports.parseBlock(v).map(wrap('{', '}')); })
                .then(exports.parseBlock);
    }
};
exports.parseAttrs = function (input) {
    input = input.trim();
    if (input === '')
        return okAttrs([], '');
    var match = input.match(/(\w+)(=|\s|$)/);
    if (!match || match.index === undefined) {
        return exports.error("Invalid attribute spec: " + input);
    }
    var rest = input.substring(match.index + match[0].length);
    var name = match[1], op = match[2];
    if (op !== '=') {
        return okAttrs([{ name: name, value: null, block: false }], rest)
            .then(exports.parseAttrs);
    }
    var block = rest[0] != '"' && rest[0] != "'";
    var value = !block
        ? exports.parseString(rest[0], rest.substring(1))
        : rest[0] == '{'
            ? exports.parseBlock(rest.substring(1))
            : exports.error("Invalid char after =. Expected ', \" or {, but got: " + rest[0]);
    if (!exports.isOk(value))
        return value;
    return okAttrs([{ name: name, value: value.value, block: block }], value.rest)
        .then(exports.parseAttrs);
};
