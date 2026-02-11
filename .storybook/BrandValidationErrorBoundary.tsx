import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches brand validation errors (e.g. EnterpriseHeading on Varsity) and shows
 * a friendly message in the Storybook canvas instead of a generic error.
 */
export class BrandValidationErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Storybook brand validation error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      return (
        <div
          role="alert"
          style={{
            padding: '1rem',
            margin: '0.5rem 0',
            backgroundColor: '#fff8e6',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#333',
          }}
        >
          <strong>Brand validation</strong>: {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}
