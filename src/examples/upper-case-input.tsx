import * as React from 'react';

export interface PropTypes {
  value: string
  onChange: (e:{ target: { value: string } }) => void
}

export const UpperCaseInput = React.createClass({
  displayName: 'UpperCaseInput',
  render() {
    return <input {...this.props} onChange={e => this.props.onChange({
      target: {
        value: e.target.value.toUpperCase()
      }
    })} />;
  }
});
