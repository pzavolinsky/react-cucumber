"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var context_1 = require("./context");
var render_1 = require("./render");
exports.createArgs = function (defs, comps, options) {
    var ctx = context_1.default(function () { return ({ vars: { $onChange: render_1.createFnVar(null) } }); });
    var render = render_1.default(function () { return ctx.get('vars'); }, comps, options.mapCreateComponent);
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
    var comp = ctx.get('comp');
    var target = comp.findByQuery(selector)[idx];
    assert_1.equal(!!target, true, "Cannot find '" + selector + "'.\n\n    Here is a dump of the rendered component that should help you\n    troubleshoot this error: \n\n" + comp.dump() + "\n\n  ");
    ctx.set('lastTarget', target);
    return target;
};
var findTargetProp = function (ctx, selector, index, key) {
    var target = findTarget(ctx, selector, index);
    var value = target.props[key];
    assert_1.equal(!!value, true, "Cannot find " + key + " in " + selector + "'s props");
    return value;
};
var rendered = function (ctx, render) {
    return function (mode, type, attrs) {
        ctx.set('comp', render(mode, type, attrs));
    };
};
var renderedText = function (ctx, render) {
    return function (mode, comp) {
        var re = /[\r\n]+/g;
        var matches = comp
            .replace(re, '')
            .trim()
            .match(/<(\w+)(\s+.*)\/>/);
        if (matches) {
            var type = matches[1], attrs = matches[2];
            ctx.set('comp', render(mode, type, attrs));
        }
        else {
            assert_1.equal(false, true, "The following does not look like a component spec:\n\n        " + comp + "\n\n      The expected component pattern is:\n\n        " + re + "\n\n      ");
        }
    };
};
var noOp = function () { ; };
var event = {
    preventDefault: noOp,
    stopPropagation: noOp
};
// --- Given ---------------------------------------------------------------- //
exports.givenRenderedComponent = function (_a) {
    var ctx = _a.ctx, defs = _a.defs, render = _a.render;
    defs.Given(/^a (?:(shallow|full) )?rendered <(\w+)(\s+.*)\/>$/, rendered(ctx, render));
    defs.Given(/^a (?:(shallow|full) )?rendered$/, renderedText(ctx, render));
};
exports.givenFunction = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    var fn = function (name, returns) {
        var retVal = returns ? JSON.parse(returns) : undefined;
        setVar(ctx, name, render_1.createFnVar(retVal));
    };
    defs.Given(/^a function (\$\w+)(?: that returns (.*))?$/, fn);
    defs.Given(/^a function (\$\w+) that returns$/, fn);
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
    defs.When(/^(?:(shallow|full) )?rendering <(\w+)(\s+.*)\/>$/, rendered(ctx, render));
    defs.When(/^(?:(shallow|full) )?rendering$/, renderedText(ctx, render));
};
exports.whenTheSelectorCallsProp = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    var fn = function (index, selector, key, withEvent, arg) {
        var fn = findTargetProp(ctx, selector, index, key);
        var fnArgs = !arg
            ? undefined
            : arg[0] == '['
                ? JSON.parse(arg)
                : [JSON.parse(arg)];
        var args = withEvent
            ? [__assign({}, event, fnArgs[0])].concat(fnArgs.slice(1)) : fnArgs;
        fn.apply(void 0, args);
    };
    defs.When(/^(?:the (?:(\d+).. )?(.*) )?calls props\.(\w+)(?: with( event)? (.*))?$/, fn);
    defs.When(/^(?:the (?:(\d+).. )?(.*) )?calls props\.(\w+) with( event)?$/, fn);
};
exports.whenTheSelectorChanges = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    var fn = function (index, selector, value) {
        var fn = findTargetProp(ctx, selector, index, 'onChange');
        fn({ target: { value: JSON.parse(value) } });
    };
    defs.When(/^(?:the (?:(\d+).. )?(.*) )?changes to (.*)$/, fn);
    defs.When(/^(?:the (?:(\d+).. )?(.*) )?changes$/, fn);
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
    var fn = function (index, selector, key, op, value) {
        var target = findTarget(ctx, selector, index);
        var actual = key === 'text'
            ? target.text
            : target.props[key.replace(/^props\./, '')];
        if (op === 'equal to') {
            assert_1.equal(JSON.stringify(actual), JSON.stringify(JSON.parse(value)));
        }
        else {
            var actualText = JSON.stringify(actual);
            assert_1.equal(!!actualText.match(new RegExp(value)), true, "The value for " + selector + "[" + index + "]." + key + " does not match:\n\n          " + value + "\n\n        The actual value is:\n\n          " + actualText + "\n        ");
        }
    };
    defs.Then(
    // tslint:disable-next-line
    /^(?:the (?:(\d+).. )?(.*) has )?(props\.\w+|text) (equal to|matching) (.*)$/, fn);
    defs.Then(/^(?:the (?:(\d+).. )?(.*) has )?(props\.\w+|text) (equal to|matching)$/, fn);
};
exports.thenThereAreSelectorElements = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    return defs.Then(/^there (?:is|are) (.+) (.+) elements?$/, function (count, selector) { return assert_1.equal(ctx.get('comp').findByQuery(selector).length, parseInt(count), "Number of '" + selector + "' mismatch"); });
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
    var fn = function (value) {
        var index = 0;
        var fn = getVar(ctx, '$onChange');
        assert_1.equal(JSON.stringify(fn.calls[index][0].target.value), JSON.stringify(JSON.parse(value)));
    };
    defs.Then(/^the component changed to (.*)$/, fn);
    defs.Then(/^the component changed to$/, fn);
};
exports.thenTheComponentDidNotChange = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    return defs.Then(/^the component (?:did not|didn't) change$/, function () { return assert_1.equal(getVar(ctx, '$onChange').calls, 0, 'The component\'s onChange function was called at least once'); });
};
exports.thenTheFunctionCallWas = function (_a) {
    var ctx = _a.ctx, defs = _a.defs;
    var fn = function (index, name, args) {
        var idx = index
            ? parseInt(index) - 1
            : 0;
        var fn = getVar(ctx, name);
        assert_1.equal(JSON.stringify(fn.calls[idx]), JSON.stringify(JSON.parse(args)));
    };
    defs.Then(/^the (?:(\d+).. )?call to (\$\w+) had arguments (.*)$/, fn);
    defs.Then(/^the (?:(\d+).. )?call to (\$\w+) had arguments$/, fn);
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
    exports.thenThereAreSelectorElements,
    exports.thenTheFunctionWasCalled,
    exports.thenTheFunctionCallWas,
    exports.thenTheComponentChanged,
    exports.thenTheComponentDidNotChange
];
