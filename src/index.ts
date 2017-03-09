import { defineSupportCode } from 'cucumber';
import steps, { createArgs, Options } from './steps';

export const register = (comps:any[], options?:Options) => {
  defineSupportCode(defs => {
    const args = createArgs(defs, comps, options || {});
    defs.Before(() => args.ctx.reset());
    steps.map(fn => fn(args));
  });
};
