import * as React from 'react';

export interface PropTypes {
  text: string
  prettify: (text:string) => string
}

export class PrettyLabel extends React.Component<PropTypes, {}> {
  render() {
    const { text, prettify } = this.props;
    return <label className="pretty">
      {prettify(text)}
    </label>;
  }
};
