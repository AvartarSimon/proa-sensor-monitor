// hooks/useCustomMessage.ts
import { message } from 'antd';

type MessageType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface CustomMessageOptions {
  type: MessageType;
  content: string;
  marginTop?: string; // optional, e.g. "20vh" or "100px"
  className?: string;
}

export const useWarnMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const showMessage = ({ type, content, marginTop = '10vh', className }: CustomMessageOptions) => {
    console.log('message', content);
    messageApi.open({
      type,
      content,
      className: className || 'custom-message',
      style: {
        marginTop,
        zIndex: '100000',
      },
    });
  };

  return { showMessage, contextHolder };
};
