import * as React from 'react';

export interface PropTypes {
  children?: any
}

// Not really a good practice, but good enought to test that you can augment
// the props of a child component.
export const FancyBorder = ({ children }:PropTypes) =>
  <div className="fancy-border">
    {React.cloneElement(children, { className: 'fancy-content' })}
  </div>;
(FancyBorder as any).displayName = 'FancyBorder';
