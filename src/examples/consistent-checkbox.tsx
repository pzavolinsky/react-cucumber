import * as React from 'react';

export interface PropTypes {
  value: boolean
  onChange: (e:{ target: { value: boolean } }) => void
}

export class ConsistentCheckbox extends React.Component<PropTypes, {}> {
  constructor(props:PropTypes, ctx:any) {
    super(props, ctx);
    this.onChange = this.onChange.bind(this);
  }
  onChange(e:React.ChangeEvent<HTMLInputElement>) {
    const { onChange } = this.props;
    onChange({ target: { value: e.target.checked } });
  }
  render() {
    return <input type="checkbox"
      {...this.props}
      value=""
      onChange={this.onChange}
    />;
  }
};
