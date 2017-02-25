import { defineSupportCode } from 'cucumber';
import steps, { createArgs } from './steps';

export const register = (comps:any[]) => {
  defineSupportCode(defs => {
    const args = createArgs(defs, comps);
    defs.Before(() => args.ctx.reset());
    steps.map(fn => fn(args));
  });
};
