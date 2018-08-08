export interface Var {
    calls: any[][];
    value: () => any;
}
export interface Vars {
    [name: string]: Var;
}
export interface Render {
    (mode: string, type: string, attrs: string): any;
}
export declare const createFnVar: (retVal: any) => Var;
export declare const createValueVar: (value: any) => Var;
export interface Spec {
    type: any;
    name: string;
    props?: {
        [name: string]: any;
    };
}
export declare const getComponentForType: (comps: any[]) => (type: string) => Spec;
export interface MapCreateComponent {
    (createComponent: any): any;
}
declare const _default: (getVars: () => Vars, comps: any[], mapCreateComponent?: MapCreateComponent | undefined) => Render;
export default _default;
