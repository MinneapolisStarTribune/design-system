import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}
const BRAND_VALIDATION_PREFIX = '[Brand Validation]';
/**
 * Error boundary that catches brand validation errors and displays the
 * validateComponentForBrand message in the Storybook canvas instead of
 * a generic error stack. Other errors are rethrown for normal handling.
 */
export class BrandValidationErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): Partial<State> | null {
    if (error.message.startsWith(BRAND_VALIDATION_PREFIX)) {
      return { error };
    }
    return null;
  }

  state: State = { error: null };

  componentDidCatch(error: Error, _errorInfo: ErrorInfo): void {
    if (!error.message.startsWith(BRAND_VALIDATION_PREFIX)) {
      throw error;
    }
  }

  render(): ReactNode {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error?.message.startsWith(BRAND_VALIDATION_PREFIX)) {
      if (fallback) {
        return fallback(error);
      }
      return (
        <div
          role="alert"
          style={{
            padding: '1rem 1.25rem',
            margin: '0.5rem 0',
            backgroundColor: '#fef3e2',
            border: '1px solid #e69500',
            borderRadius: '6px',
            color: '#1a1a1a',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            lineHeight: 1.4,
          }}
        >
          <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Brand validation</strong>
          {error.message.replace(BRAND_VALIDATION_PREFIX, '').trim()}
        </div>
      );
    }

    return children;
  }
}
