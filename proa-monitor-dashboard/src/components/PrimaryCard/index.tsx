import React from 'react';

import './PrimaryCard.css';

export interface PrimaryCardProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function PrimaryCard(props: PrimaryCardProps) {
  const { title, children, className = '', style = {} } = props;

  return (
    <div className={`primary-card ${className}`} style={style}>
      {title && <div className="primary-card__title">{title}</div>}
      <div className="primary-card__content">{children}</div>
    </div>
  );
}
