"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var context_1 = require("./context");
var render_1 = require("./render");
exports.createArgs = function (defs, comps) {
    var ctx = context_1.default(function () { return ({ vars: { $onChange: render_1.createFnVar(null) } }); });
    var render = render_1.default(function () { return ctx.get('vars'); }, comps);
    return {
        ctx: ctx,
        defs: defs,
        render: render
    };
};
var getVar = function (ctx, name) { return ctx.get('vars')[name]; };
var setVar = function (ctx, name, v) { return ctx.get('vars')[name] = v; };
var findTarget = function (ctx, selector, index) {
    if (!selector)
        return ctx.get('lastTarget');
    var idx = index
        ? parseInt(index) - 1
        : 0;
    var target = ctx.get('comp').findByQuery(selector)[idx];
    ctx.set('lastTarget', target);
    return target;
};
var findTargetProp = function (ctx, selector, index, key) {
    var target = findTarget(ctx, selector, index);
    var value = target.props[key];
    assert_1.equal(!!value, true, "Cannot find " + key + " in " + selector + "'s props");
    return value;
};
// --- Given ---------------------------------------------------------------- //
exports.givenRenderedComponent = function (_a) {
    var ctx = _a.ctx, defs = _a.defs, render = _a.render;
    return defs.Given(/^a rendered <(\w+)(\s+.*)\/>$/, function (type, attrs) {
        ctx.set('comp', render(type, attrs));
    });
};
exports.givenFunction = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    return defs.Given(/^a function (\$\w+)(?: that returns (.*))?$/, function (name, returns) {
        var retVal = returns ? JSON.parse(returns) : undefined;
        setVar(ctx, name, render_1.createFnVar(retVal));
    });
};
exports.givenVariable = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    var fn = function (name, value) {
        setVar(ctx, name, render_1.createValueVar(JSON.parse(value)));
    };
    defs.Given(/^that (\$\w+) is (.*)$/, fn);
    defs.Given(/^that (\$\w+) is$/, fn);
};
// --- When ----------------------------------------------------------------- //
exports.whenRenderingComponent = function (_a) {
    var ctx = _a.ctx, defs = _a.defs, render = _a.render;
    return defs.When(/^rendering <(\w+)(\s+.*)\/>$/, function (type, attrs) {
        ctx.set('comp', render(type, attrs));
    });
};
exports.whenTheSelectorCallsProp = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    return defs.When(/^(?:the (?:(\d+).. )?(.*) )?calls props\.(\w+)(?: with (.*))?$/, function (index, selector, key, args) {
        var fn = findTargetProp(ctx, selector, index, key);
        var fnArgs = !args
            ? undefined
            : args[0] == '['
                ? JSON.parse(args)
                : [JSON.parse(args)];
        fn.apply(void 0, fnArgs);
    });
};
exports.whenTheSelectorChanges = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    return defs.When(/^(?:the (?:(\d+).. )?(.*) )?changes to (.*)$/, function (index, selector, value) {
        var fn = findTargetProp(ctx, selector, index, 'onChange');
        fn({ target: { value: JSON.parse(value) } });
    });
};
// --- Then ----------------------------------------------------------------- //
exports.thenDumpComponent = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    return defs.Then(/^dump the rendered component$/, function () {
        return console.log('\n\nComponent\n---------\n\n', ctx.get('comp').dump());
    });
};
exports.thenDumpContext = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    return defs.Then(/^dump the test context$/, function () { return ctx.dump(); });
};
exports.thenTheSelectorHasProp = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    return defs.Then(/^(?:the (?:(\d+).. )?(.*) has )?(props\.\w+|text) equal to (.*)$/, function (index, selector, key, value) {
        var target = findTarget(ctx, selector, index);
        var actual = key === 'text'
            ? target.text
            : target.props[key.replace(/^props\./, '')];
        assert_1.equal(JSON.stringify(actual), JSON.stringify(JSON.parse(value)));
    });
};
exports.thenTheFunctionWasCalled = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    return defs.Then(/^the function (\$\w+) was called (?:(\d+) times|once)?$/, function (name, times) {
        var fn = getVar(ctx, name);
        assert_1.equal(fn.calls.length, parseInt(times || '1'));
    });
};
exports.thenTheComponentChanged = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    return defs.Then(/^the component changed to (.*)$/, function (value) {
        var index = 0;
        var fn = getVar(ctx, '$onChange');
        assert_1.equal(JSON.stringify(fn.calls[index][0].target.value), JSON.stringify(JSON.parse(value)));
    });
};
exports.thenTheFunctionCallWas = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    return defs.Then(/^the (?:(\d+).. )?call to (\$\w+) had arguments (.*)$/, function (index, name, args) {
        var idx = index
            ? parseInt(index) - 1
            : 0;
        var fn = getVar(ctx, name);
        assert_1.equal(JSON.stringify(fn.calls[idx]), JSON.stringify(JSON.parse(args)));
    });
};
// -------------------------------------------------------------------------- //
exports.default = [
    exports.givenRenderedComponent,
    exports.givenFunction,
    exports.givenVariable,
    exports.whenRenderingComponent,
    exports.whenTheSelectorCallsProp,
    exports.whenTheSelectorChanges,
    exports.thenDumpComponent,
    exports.thenDumpContext,
    exports.thenTheSelectorHasProp,
    exports.thenTheFunctionWasCalled,
    exports.thenTheFunctionCallWas,
    exports.thenTheComponentChanged
];
