import { equal } from 'assert';
import { StepDefinitions } from 'cucumber';
import createContext, { Context } from './context';
import renderComps, { createFnVar, createValueVar, Render, Var }
  from './render';

export interface StepArgs {
  ctx: Context
  defs: StepDefinitions
  render: Render
}

export const createArgs = (defs:StepDefinitions, comps:any[]):StepArgs => {
  const ctx = createContext(() => ({ vars: { $onChange: createFnVar(null) } }));
  const render = renderComps(() => ctx.get('vars'), comps);
  return {
    ctx,
    defs,
    render
  };
};

const getVar = (ctx:Context, name:string) => ctx.get('vars')[name];
const setVar = (ctx:Context, name:string, v:Var) => ctx.get('vars')[name] = v;

const findTarget = (ctx:Context, selector:any, index:string) => {
  if (!selector) return ctx.get('lastTarget');
  const idx = index
    ? parseInt(index) - 1
    : 0;
  const target = ctx.get('comp').findByQuery(selector)[idx];
  ctx.set('lastTarget', target);
  return target;
};

const findTargetProp = (
  ctx:Context,
  selector:any,
  index:string,
  key:string
) => {
  const target = findTarget(ctx, selector, index);
  const value = target.props[key];
  equal(!!value, true, `Cannot find ${key} in ${selector}'s props`);
  return value;
};

const rendered = (ctx:Context, render:Render) =>
  (mode:string, type:string, attrs:string) => {
    ctx.set('comp', render(mode, type, attrs));
  };

// --- Given ---------------------------------------------------------------- //

export const givenRenderedComponent = ({ ctx, defs, render }:StepArgs) =>
  defs.Given(/^a (?:(shallow|full) )?rendered <(\w+)(\s+.*)\/>$/,
    rendered(ctx, render));

export const givenFunction = ({ ctx, defs }:StepArgs) =>
  defs.Given(/^a function (\$\w+)(?: that returns (.*))?$/,
    (name:string, returns:string) => {
      const retVal = returns ? JSON.parse(returns) : undefined;
      setVar(ctx, name, createFnVar(retVal));
    }
  );
export const givenVariable = ({ ctx, defs }:StepArgs) => {
  const fn = (name:string, value:string) => {
    setVar(ctx, name, createValueVar(JSON.parse(value)));
  };
  defs.Given(/^that (\$\w+) is (.*)$/, fn);
  defs.Given(/^that (\$\w+) is$/, fn);
};
// --- When ----------------------------------------------------------------- //

export const whenRenderingComponent = ({ ctx, defs, render }:StepArgs) =>
  defs.When(/^(?:(shallow|full) )?rendering <(\w+)(\s+.*)\/>$/,
    rendered(ctx, render));

export const whenTheSelectorCallsProp = ({ ctx, defs }:StepArgs) =>
  defs.When(/^(?:the (?:(\d+).. )?(.*) )?calls props\.(\w+)(?: with (.*))?$/,
    (index:string, selector:string, key:string, args:string) => {
      const fn = findTargetProp(ctx, selector, index, key);
      const fnArgs = !args
        ? undefined
        : args[0] == '['
          ? JSON.parse(args)
          : [ JSON.parse(args) ];
      fn(...fnArgs);
    }
  );

export const whenTheSelectorChanges = ({ ctx, defs }:StepArgs) =>
  defs.When(/^(?:the (?:(\d+).. )?(.*) )?changes to (.*)$/,
    (index:string, selector:string, value:string) => {
      const fn = findTargetProp(ctx, selector, index, 'onChange');
      fn({ target: { value: JSON.parse(value) }});
    }
  );

// --- Then ----------------------------------------------------------------- //

export const thenDumpComponent = ({ ctx, defs }:StepArgs) =>
  defs.Then(/^dump the rendered component$/, () =>
    console.log('\n\nComponent\n---------\n\n', ctx.get('comp').dump()));

export const thenDumpContext = ({ ctx, defs }:StepArgs) =>
  defs.Then(/^dump the test context$/, () => ctx.dump());

export const thenTheSelectorHasProp = ({ ctx, defs }:StepArgs) =>
  defs.Then(/^(?:the (?:(\d+).. )?(.*) has )?(props\.\w+|text) equal to (.*)$/,
    (index:string, selector:string, key:string, value:string) => {
      const target = findTarget(ctx, selector, index);
      const actual = key === 'text'
        ? target.text
        : target.props[key.replace(/^props\./, '')];
      equal(JSON.stringify(actual), JSON.stringify(JSON.parse(value)));
    }
  );

export const thenTheFunctionWasCalled = ({ ctx, defs }:StepArgs) =>
  defs.Then(/^the function (\$\w+) was called (?:(\d+) times|once)?$/,
    (name:string, times:string) => {
      const fn = getVar(ctx, name);
      equal(fn.calls.length, parseInt(times || '1'));
    }
  );

export const thenTheComponentChanged = ({ ctx, defs }:StepArgs) =>
  defs.Then(/^the component changed to (.*)$/,
    (value:string) => {
      const index = 0;
      const fn = getVar(ctx, '$onChange');
      equal(
        JSON.stringify(fn.calls[index][0].target.value),
        JSON.stringify(JSON.parse(value))
      );
    }
  );

export const thenTheFunctionCallWas = ({ ctx, defs }:StepArgs) =>
  defs.Then(/^the (?:(\d+).. )?call to (\$\w+) had arguments (.*)$/,
    (index:string, name:string, args:string) => {
      const idx = index
        ? parseInt(index) - 1
        : 0;
      const fn = getVar(ctx, name);
      equal(JSON.stringify(fn.calls[idx]), JSON.stringify(JSON.parse(args)));
    }
  );

// -------------------------------------------------------------------------- //

export default [
  givenRenderedComponent,
  givenFunction,
  givenVariable,
  whenRenderingComponent,
  whenTheSelectorCallsProp,
  whenTheSelectorChanges,
  thenDumpComponent,
  thenDumpContext,
  thenTheSelectorHasProp,
  thenTheFunctionWasCalled,
  thenTheFunctionCallWas,
  thenTheComponentChanged
];
