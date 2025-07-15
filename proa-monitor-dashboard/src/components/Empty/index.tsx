import React from 'react';

import './Empty.css';

export interface EmptyProps extends React.ComponentPropsWithRef<'div'> {
  imageWidth?: number;
}

export function Empty(props: EmptyProps) {
  const { className = '', imageWidth = 160, ...restProps } = props;

  return (
    <div className={`empty ${className}`} {...restProps}>
      <div className="empty__image" style={{ width: imageWidth, height: imageWidth / 1.333 }} />
    </div>
  );
}
