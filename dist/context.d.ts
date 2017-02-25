export interface Context {
    get: (key: string) => any;
    set: (key: string, value: any) => any;
    reset: () => void;
    dump: () => void;
}
declare var _default: (def: () => {
    [key: string]: any;
}) => Context;
export default _default;
