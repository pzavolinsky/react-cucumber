import { equal } from 'assert';
import createComponent = require('react-unit');
import { createElement } from 'react';
import { either, parseAttrs } from './parser';

export interface Var {
  calls: any[][]
  value: () => any
}

export interface Vars {
  [name:string]:Var
}

export interface Render {
  (mode:string, type:string, attrs:string):any
}

export const createFnVar = (retVal:any):Var => {
  const calls:any[][] = [];
  return {
    calls,
    value: function() {
      calls.push(Array.prototype.slice.call(arguments));
      return retVal;
    }
  };
};
export const createValueVar = (value:any):Var => ({
  calls: [],
  value
});

const parseValue = (vars:Vars, value:string|null, block:boolean) =>
  value === null
  ? null
  : value[0] == '$'
    ? vars[value].value
    : block
      ? JSON.parse(value)
      : value;

const getName = (c:any):string =>
  c.displayName || c.name || c.constructor && c.constructor.name;

interface Spec {
  type: any
  name: string
  props?: { [name:string]:any }
}

const getSpec = (c:any):Spec =>
  typeof c === 'function'
  ? { type: c, name: getName(c) }
  : c;

export default (getVars:() => Vars, comps:any[]):Render => {
  const specMap:{ [name:string]:Spec } = comps
    .map(getSpec)
    .reduce((cs, spec) => ({ ...cs, [spec.name]: spec }), {});

  return (mode, type, attrString) => {
    const vars = getVars();

    const spec = specMap[type];
    // tslint:disable
    equal(!!spec, true, `Invalid type: ${type}.

      Maybe the component was not registered or is missing a displayName.

      Sometimes you will need to explicitly add a displayName to your
      components (e.g. high-order components). Alternatively you can specify
      the component name in the registration function call in
      features/step_definitions.

      For more info see:
        https://github.com/pzavolinsky/react-cucumber/blob/master/features/step_definitions/react.js

      Known components are:
        ${Object.keys(specMap).join(', ')}
    
    `);
    // tslint:enable

    const attrs = either(parseAttrs(attrString));
    if (typeof attrs === 'string') {
      equal(false, true, attrs); // invalid string
      return null;
    }

    const props = attrs.value.reduce((p, a) =>
      ({ ...p, [a.name]: parseValue(vars, a.value, a.block) }), {});

    const cc = !mode
      ? createComponent
      : mode == 'shallow'
        ? (createComponent as any).shallow
        : (createComponent as any).interleaved;

    return cc(createElement(spec.type, {
      ...(spec.props || {}),
      ...props
    }));
  };
};
