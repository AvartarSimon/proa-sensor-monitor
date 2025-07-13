import { ConfigProvider } from 'antd';
import en_GB from 'antd/es/locale/en_GB';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { TemperatureProvider } from './contexts/TemperatureContext';
import { store } from './store';

// rewrite the transition data
en_GB.DatePicker!.lang.rangePlaceholder = ['Start Time', 'End Time'];

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found!');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <ConfigProvider locale={en_GB}>
      <ErrorBoundary>
        <TemperatureProvider>
          <App />
        </TemperatureProvider>
      </ErrorBoundary>
    </ConfigProvider>
  </Provider>,
);
