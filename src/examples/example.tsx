import * as React from 'react';

export interface PropTypes {
  value: string
  onChange: (e:any) => void
}

export const FancyInput = (props:PropTypes) =>
  <input className="fancy" {...props} />;

export class FancyLabel extends React.Component<PropTypes, {}> {
  render() {
    return <label className="fancy">label for {this.props.value}</label>;
  }
}

export const UppercaseInput = (props:PropTypes) =>
  <input {...props} onChange={e => props.onChange({
    target: {
      value: e.target.value.toUpperCase()
    }
  })} />;
(UppercaseInput as any).displayName = 'UppercaseInput';

export const ChangingInput = (props:PropTypes) =>
  <input {...props} onChange={() => props.onChange('changed!')} />;
(ChangingInput as any).displayName = 'ChangingInput';
