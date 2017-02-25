export interface Context {
  get: (key:string) => any
  set: (key:string, value:any) => any
  reset: () => void,
  dump: () => void
}

export default (def:() => { [key:string]:any }):Context => {
  let state:{ [key:string]:any } = def;
  return {
    get: k => state[k],
    set: (k, v) => state[k] = v,
    reset: () => { state = def(); },
    dump: () => console.log('\n\nContext\n---------\n\n', state)
  };
};
