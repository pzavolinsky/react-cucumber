import * as React from 'react';

export interface PropTypes {
  value: string
  onChange: (e:{ target: { value: string } }) => void
}

export class UpperCaseInput extends React.Component<PropTypes, void> {
  render() {
    return <input {...this.props}
      onChange={e => this.props.onChange({
        target: {
          value: e.target.value.toUpperCase()
        }
      })}
      value={this.props.value.toUpperCase()}
    />;
  }
}
