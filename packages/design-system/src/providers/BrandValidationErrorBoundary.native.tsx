import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BRAND_VALIDATION_ERROR_PREFIX } from './BrandValidationErrorBoundary.constants';

export { BRAND_VALIDATION_ERROR_PREFIX };

interface Props {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Error boundary that catches brand validation errors and displays a clear
 * message instead of a generic error stack. Other errors are rethrown.
 * React Native implementation.
 */
export class BrandValidationErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): Partial<State> | null {
    if (error.message.startsWith(BRAND_VALIDATION_ERROR_PREFIX)) {
      return { error };
    }
    return null;
  }

  state: State = { error: null };

  componentDidCatch(error: Error, _errorInfo: ErrorInfo): void {
    if (!error.message.startsWith(BRAND_VALIDATION_ERROR_PREFIX)) {
      throw error;
    }
  }

  render(): ReactNode {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error?.message.startsWith(BRAND_VALIDATION_ERROR_PREFIX)) {
      if (fallback) {
        return fallback(error);
      }
      const message = error.message.replace(BRAND_VALIDATION_ERROR_PREFIX, '').trim();
      return (
        <View accessible accessibilityRole="alert" style={styles.container}>
          <Text style={styles.title}>Brand validation</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      );
    }

    return children;
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fef3e2',
    borderWidth: 1,
    borderColor: '#e69500',
    borderRadius: 6,
  },
  title: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  message: {
    fontFamily: 'System',
    fontSize: 14,
    lineHeight: 20,
    color: '#1a1a1a',
  },
});
