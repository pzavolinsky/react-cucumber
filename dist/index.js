"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cucumber_1 = require("cucumber");
var steps_1 = require("./steps");
exports.register = function (comps, options) {
    cucumber_1.defineSupportCode(function (defs) {
        var args = steps_1.createArgs(defs, comps, options || {});
        defs.Before(function () { return args.ctx.reset(); });
        steps_1.default.map(function (fn) { return fn(args); });
    });
};
