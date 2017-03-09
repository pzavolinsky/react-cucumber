import * as React from 'react';

export interface PropTypes {
  text: string
  onClick: (text:string) => void
}

export class Clicky extends React.Component<PropTypes, {}> {
  constructor(props:PropTypes, ctx:any) {
    super(props, ctx);
    this.onClick = this.onClick.bind(this);
  }
  onClick(e:React.MouseEvent<HTMLDivElement>) {
    const { text, onClick } = this.props;
    e.stopPropagation();
    e.preventDefault();
    onClick(text);
  }
  render() {
    const { text } = this.props;
    return <div className="clicky" onClick={this.onClick}>
      {text}
    </div>;
  }
};
