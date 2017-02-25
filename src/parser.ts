export interface Parsed<T> {
  map: (fn:(value:T) => T) => Parsed<T>
  then: (fn:(rest:string) => Parsed<T>) => Parsed<T>
}
export interface ParsedOk<T> extends Parsed<T> {
  value: T
  rest: string
}
export interface ParsedError extends Parsed<any> {
  msg: string
}

export const isOk = <T>(v:Parsed<T>) : v is ParsedOk<T> =>
  (v as ParsedOk<T>).rest !== undefined;
export const isError = <T>(v:Parsed<T>) : v is ParsedError =>
  (v as ParsedError).msg !== undefined;

export const either = <T>(v:Parsed<T>) => isOk(v)
  ? v
  : (v as ParsedError).msg;

const ok = <T>(add:(a:T, b:T) => T) => (value:T, rest:string):ParsedOk<T> => ({
  value,
  rest,
  map: fn => ok(add)(fn(value), rest),
  then: fn => fn(rest).map(v => add(value, v))
});

export const error = (msg:string):ParsedError => ({
  map: _ => error(msg),
  then: _ => error(msg),
  msg
});

export interface Attr {
  name: string
  value: string|null
  block: boolean
}

const okString = ok<string>((a, b) => a + b);
const okAttrs = ok<Attr[]>((a, b) => a.concat(b));
// ---

const splitAt = (s:string, n:number):ParsedOk<string> => okString(
  s.substring(0, n),
  s.substring(n + 1)
);
const wrap = (start:string, end:string) => (v:string) => start + v + end;

export const parseString = (delim:string, input:string):Parsed<string> => {
  const end = input.indexOf(delim);
  if (end === -1) return error(`Incomplete string: ${input}`);
  const p = splitAt(input, end);
  return p.value.replace(/\\\\/g, '').match(/\\$/)
    ? p.then(r => parseString(delim, r).map(v => delim + v)) // \delim
    : p;
};

export const parseBlock = (input:string):Parsed<string> => {
  const end = input.match(/[{}"']/);
  if (!end || end.index === undefined) {
    return error(`Incomplete block: ${input}`);
  }
  const p = splitAt(input, end.index);
  const c = end[0];
  switch (c) {
    case '}':
      return p;
    case '"':
    case "'":
      return p
      .then(v => parseString(c, v).map(wrap(c, c)))
      .then(parseBlock);
    default: // '{'
      return p
      .then(v => parseBlock(v).map(wrap('{', '}')))
      .then(parseBlock);
  }
};

export const parseAttrs = (input:string):Parsed<Attr[]> => {

  input = input.trim();

  if (input === '') return okAttrs([], '');

  const match = input.match(/(\w+)(=|\s|$)/);
  if (!match || match.index === undefined) {
    return error(`Invalid attribute spec: ${input}`);
  }

  const rest = input.substring(match.index + match[0].length);
  const [ , name, op ] = match;
  if (op !== '=') {
    return okAttrs([{ name, value: null, block: false }], rest)
    .then(parseAttrs);
  }

  const block = rest[0] != '"' && rest[0] != "'";

  const value = !block
    ? parseString(rest[0], rest.substring(1))
    : rest[0] == '{'
      ? parseBlock(rest.substring(1))
      : error(`Invalid char after =. Expected ', " or {, but got: ${rest[0]}`);

  if (!isOk(value)) return value as ParsedError;

  return okAttrs([{ name, value: value.value, block }], value.rest)
    .then(parseAttrs);
};
