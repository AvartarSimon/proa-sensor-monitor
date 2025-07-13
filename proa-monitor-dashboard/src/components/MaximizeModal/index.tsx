import { Modal, type ModalProps } from 'antd';
import React from 'react';

import './MaximizeModal.css';

export interface MaximizeModalProps extends ModalProps {
  children: React.ReactNode;
}

export function MaximizeModal(props: MaximizeModalProps) {
  const { children, ...restProps } = props;

  return (
    <Modal
      {...restProps}
      className="maximize-modal"
      footer={null}
      closable={false}
      maskClosable={false}
      width="90vw"
      style={{ top: 20 }}
    >
      <div className="maximize-modal__content">
        <div className="maximize-modal__header">
          <span>Vehicle Tracking Dashboard</span>
          <button 
            className="maximize-modal__close"
            onClick={restProps.onCancel}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: '16px' }}>
          {children}
        </div>
      </div>
    </Modal>
  );
}
