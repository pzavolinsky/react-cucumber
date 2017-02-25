export interface Var {
    calls: any[][];
    value: () => any;
}
export interface Vars {
    [name: string]: Var;
}
export interface Render {
    (type: string, attrs: string): any;
}
export declare const createFnVar: (retVal: any) => Var;
export declare const createValueVar: (value: any) => Var;
declare var _default: (getVars: () => Vars, comps: any[]) => Render;
export default _default;
