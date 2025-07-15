import React from 'react';

import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * 捕获子组件的异常，并降级UI展示
 * https://zh-hans.reactjs.org/docs/error-boundaries.html
 */
export default class ErrorBoundary extends React.PureComponent<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // componentDidCatch(error: any, errorInfo: any) {
  //   // Log error information or send to server
  // }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div>Loading error, please refresh the page</div>
        </div>
      );
    }

    return this.props.children;
  }
}
