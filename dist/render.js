"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var createComponent = require("react-unit");
var react_1 = require("react");
var parser_1 = require("./parser");
exports.createFnVar = function (retVal) {
    var calls = [];
    return {
        calls: calls,
        value: function () {
            calls.push(Array.prototype.slice.call(arguments));
            return retVal;
        }
    };
};
exports.createValueVar = function (value) { return ({
    calls: [],
    value: value
}); };
var parseValue = function (vars, value, block) {
    return value === null
        ? null
        : value[0] == '$'
            ? vars[value].value
            : block
                ? JSON.parse(value)
                : value;
};
var getName = function (c) {
    return c.displayName || c.name || c.constructor && c.constructor.name;
};
var getSpec = function (c) {
    return typeof c === 'function'
        ? { type: c, name: getName(c) }
        : c;
};
exports.default = function (getVars, comps) {
    var specMap = comps
        .map(getSpec)
        .reduce(function (cs, spec) {
        return (__assign({}, cs, (_a = {}, _a[spec.name] = spec, _a)));
        var _a;
    }, {});
    return function (type, attrString) {
        var vars = getVars();
        var spec = specMap[type];
        assert_1.equal(!!spec, true, "Invalid type: " + type + ".\n\n       Maybe the component was not registered or is missing a displayName.\n\n       Sometimes you will need to explicitly add a displayName to your\n       components (e.g. high-order components). Alternatively you can specify\n       the component name in the registration function call in\n       features/step_definitions.\n\n       Known components are: " + Object.keys(specMap).join(', ') + "\n     ");
        var attrs = parser_1.either(parser_1.parseAttrs(attrString));
        if (typeof attrs === 'string') {
            assert_1.equal(false, true, attrs); // invalid string
            return null;
        }
        var props = attrs.value.reduce(function (p, a) {
            return (__assign({}, p, (_a = {}, _a[a.name] = parseValue(vars, a.value, a.block), _a)));
            var _a;
        }, {});
        return createComponent(react_1.createElement(spec.type, __assign({}, (spec.props || {}), props)));
    };
};
