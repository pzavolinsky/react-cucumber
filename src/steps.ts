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
  const comp = ctx.get('comp');
  const target = comp.findByQuery(selector)[idx];
  equal(!!target, true, `Cannot find '${selector}'.

    Here is a dump of the rendered component that should help you
    troubleshoot this error: \n\n${comp.dump()}\n
  `);

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

const renderedText = (ctx:Context, render:Render) =>
  (mode:string, comp:string) => {
    const re = /[\r\n]+/g;
    const matches = comp
      .replace(re, '')
      .trim()
      .match(/<(\w+)(\s+.*)\/>/);
    if (matches) {
      const [ , type, attrs ] = matches;
      ctx.set('comp', render(mode, type, attrs));
    } else {
      equal(false, true, `The following does not look like a component spec:

        ${comp}

      The expected component pattern is:

        ${re}

      `);
    }
  };

const noOp = () => { ; };

const event = {
  preventDefault: noOp,
  stopPropagation: noOp
};

// --- Given ---------------------------------------------------------------- //

export const givenRenderedComponent = ({ ctx, defs, render }:StepArgs) => {
  defs.Given(/^a (?:(shallow|full) )?rendered <(\w+)(\s+.*)\/>$/,
    rendered(ctx, render)
  );
  defs.Given(/^a (?:(shallow|full) )?rendered$/, renderedText(ctx, render));
};

export const givenFunction = ({ ctx, defs }:StepArgs) => {
  const fn = (name:string, returns:string) => {
    const retVal = returns ? JSON.parse(returns) : undefined;
    setVar(ctx, name, createFnVar(retVal));
  };
  defs.Given(/^a function (\$\w+)(?: that returns (.*))?$/, fn);
  defs.Given(/^a function (\$\w+) that returns$/, fn);
};

export const givenVariable = ({ ctx, defs }:StepArgs) => {
  const fn = (name:string, value:string) => {
    setVar(ctx, name, createValueVar(JSON.parse(value)));
  };
  defs.Given(/^that (\$\w+) is (.*)$/, fn);
  defs.Given(/^that (\$\w+) is$/, fn);
};
// --- When ----------------------------------------------------------------- //

export const whenRenderingComponent = ({ ctx, defs, render }:StepArgs) => {
  defs.When(/^(?:(shallow|full) )?rendering <(\w+)(\s+.*)\/>$/,
    rendered(ctx, render));
  defs.When(/^(?:(shallow|full) )?rendering$/,
    renderedText(ctx, render));
};

export const whenTheSelectorCallsProp = ({ ctx, defs }:StepArgs) => {
  const fn = (
    index:string,
    selector:string,
    key:string,
    withEvent:string,
    arg:string
  ) => {
    const fn = findTargetProp(ctx, selector, index, key);
    const fnArgs:any[] = !arg
      ? undefined
      : arg[0] == '['
        ? JSON.parse(arg)
        : [ JSON.parse(arg) ];
    const args = withEvent
      ? [ { ...event, ...fnArgs[0] }, ...fnArgs.slice(1) ]
      : fnArgs;
    fn(...args);
  };
  defs.When(
    /^(?:the (?:(\d+).. )?(.*) )?calls props\.(\w+)(?: with( event)? (.*))?$/,
    fn
  );
  defs.When(
    /^(?:the (?:(\d+).. )?(.*) )?calls props\.(\w+) with( event)?$/,
    fn
  );
};

export const whenTheSelectorChanges = ({ ctx, defs }:StepArgs) => {
  const fn = (index:string, selector:string, value:string) => {
    const fn = findTargetProp(ctx, selector, index, 'onChange');
    fn({ target: { value: JSON.parse(value) }});
  };
  defs.When(/^(?:the (?:(\d+).. )?(.*) )?changes to (.*)$/, fn);
  defs.When(/^(?:the (?:(\d+).. )?(.*) )?changes$/, fn);
};

// --- Then ----------------------------------------------------------------- //

export const thenDumpComponent = ({ ctx, defs }:StepArgs) =>
  defs.Then(/^dump the rendered component$/, () =>
    console.log('\n\nComponent\n---------\n\n', ctx.get('comp').dump()));

export const thenDumpContext = ({ ctx, defs }:StepArgs) =>
  defs.Then(/^dump the test context$/, () => ctx.dump());

export const thenTheSelectorHasProp = ({ ctx, defs }:StepArgs) => {
  const fn = (index:string, selector:string, key:string, value:string) => {
    const target = findTarget(ctx, selector, index);
    const actual = key === 'text'
      ? target.text
      : target.props[key.replace(/^props\./, '')];
    equal(JSON.stringify(actual), JSON.stringify(JSON.parse(value)));
  };
  defs.Then(/^(?:the (?:(\d+).. )?(.*) has )?(props\.\w+|text) equal to (.*)$/,
    fn);
  defs.Then(/^(?:the (?:(\d+).. )?(.*) has )?(props\.\w+|text) equal to$/, fn);
};

export const thenTheFunctionWasCalled = ({ ctx, defs }:StepArgs) =>
  defs.Then(/^the function (\$\w+) was called (?:(\d+) times|once)?$/,
    (name:string, times:string) => {
      const fn = getVar(ctx, name);
      equal(fn.calls.length, parseInt(times || '1'));
    }
  );

export const thenTheComponentChanged = ({ ctx, defs }:StepArgs) => {
  const fn = (value:string) => {
    const index = 0;
    const fn = getVar(ctx, '$onChange');
    equal(
      JSON.stringify(fn.calls[index][0].target.value),
      JSON.stringify(JSON.parse(value))
    );
  };
  defs.Then(/^the component changed to (.*)$/, fn);
  defs.Then(/^the component changed to$/, fn);
};

export const thenTheFunctionCallWas = ({ ctx, defs }:StepArgs) => {
  const fn = (index:string, name:string, args:string) => {
    const idx = index
      ? parseInt(index) - 1
      : 0;
    const fn = getVar(ctx, name);
    equal(JSON.stringify(fn.calls[idx]), JSON.stringify(JSON.parse(args)));
  };
  defs.Then(/^the (?:(\d+).. )?call to (\$\w+) had arguments (.*)$/, fn);
  defs.Then(/^the (?:(\d+).. )?call to (\$\w+) had arguments$/, fn);
};

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
