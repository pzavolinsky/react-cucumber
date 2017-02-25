export interface Parsed<T> {
    map: (fn: (value: T) => T) => Parsed<T>;
    then: (fn: (rest: string) => Parsed<T>) => Parsed<T>;
}
export interface ParsedOk<T> extends Parsed<T> {
    value: T;
    rest: string;
}
export interface ParsedError extends Parsed<any> {
    msg: string;
}
export declare const isOk: <T>(v: Parsed<T>) => v is ParsedOk<T>;
export declare const isError: <T>(v: Parsed<T>) => v is ParsedError;
export declare const either: <T>(v: Parsed<T>) => string | ParsedOk<T>;
export declare const error: (msg: string) => ParsedError;
export interface Attr {
    name: string;
    value: string | null;
    block: boolean;
}
export declare const parseString: (delim: string, input: string) => Parsed<string>;
export declare const parseBlock: (input: string) => Parsed<string>;
export declare const parseAttrs: (input: string) => Parsed<Attr[]>;
