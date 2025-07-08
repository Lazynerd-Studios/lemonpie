"use client";

import * as React from "react";
import { 
  AlertCircle, 
  RefreshCw, 
  Home, 
  ArrowLeft, 
  Bug, 
  Wifi, 
  Server,
  AlertTriangle,
  XCircle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import styles from "./enhanced-error-boundary.module.css";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  level?: "page" | "section" | "component";
  name?: string;
  showRetry?: boolean;
  showReload?: boolean;
  showHome?: boolean;
  showBack?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

type ErrorType = "network" | "chunk" | "runtime" | "boundary" | "unknown";

class EnhancedErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // In production, log to error reporting service
    if (process.env.NODE_ENV === "production") {
      this.logErrorToService(error, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
    // This would integrate with your error reporting service
    // e.g., Sentry, LogRocket, etc.
    console.log("Logging error to service:", { error, errorInfo });
  }

  private getErrorType(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    
    if (message.includes("network") || message.includes("fetch")) {
      return "network";
    }
    
    if (message.includes("chunk") || message.includes("loading")) {
      return "chunk";
    }
    
    if (message.includes("boundary")) {
      return "boundary";
    }
    
    if (error.name === "TypeError" || error.name === "ReferenceError") {
      return "runtime";
    }
    
    return "unknown";
  }

  resetError = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: this.state.retryCount + 1
    });
  };

  retryWithDelay = (delay: number = 1000) => {
    this.retryTimeoutId = setTimeout(() => {
      this.resetError();
    }, delay);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error!} 
            resetError={this.resetError} 
          />
        );
      }

      return (
        <EnhancedErrorFallback 
          error={this.state.error!} 
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          retryWithDelay={this.retryWithDelay}
          retryCount={this.state.retryCount}
          level={this.props.level}
          name={this.props.name}
          showRetry={this.props.showRetry}
          showReload={this.props.showReload}
          showHome={this.props.showHome}
          showBack={this.props.showBack}
        />
      );
    }

    return this.props.children;
  }
}

interface EnhancedErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo | null;
  resetError: () => void;
  retryWithDelay: (delay?: number) => void;
  retryCount: number;
  level?: "page" | "section" | "component";
  name?: string;
  showRetry?: boolean;
  showReload?: boolean;
  showHome?: boolean;
  showBack?: boolean;
}

function EnhancedErrorFallback({ 
  error, 
  errorInfo,
  resetError,
  retryWithDelay,
  retryCount,
  level = "component",
  name,
  showRetry = true,
  showReload = true,
  showHome = false,
  showBack = false
}: EnhancedErrorFallbackProps) {
  const errorType = React.useMemo(() => {
    const message = error.message.toLowerCase();
    
    if (message.includes("network") || message.includes("fetch")) {
      return "network";
    }
    
    if (message.includes("chunk") || message.includes("loading")) {
      return "chunk";
    }
    
    if (message.includes("boundary")) {
      return "boundary";
    }
    
    if (error.name === "TypeError" || error.name === "ReferenceError") {
      return "runtime";
    }
    
    return "unknown";
  }, [error]);

  const getErrorIcon = () => {
    switch (errorType) {
      case "network":
        return <Wifi className="h-6 w-6" />;
      case "chunk":
        return <Server className="h-6 w-6" />;
      case "runtime":
        return <Bug className="h-6 w-6" />;
      case "boundary":
        return <AlertTriangle className="h-6 w-6" />;
      default:
        return <AlertCircle className="h-6 w-6" />;
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case "network":
        return "Network Connection Error";
      case "chunk":
        return "Loading Error";
      case "runtime":
        return "Runtime Error";
      case "boundary":
        return "Component Error";
      default:
        return "Unexpected Error";
    }
  };

  const getErrorMessage = () => {
    switch (errorType) {
      case "network":
        return "There seems to be a problem with your internet connection. Please check your connection and try again.";
      case "chunk":
        return "Failed to load a part of the application. This might be due to a temporary issue. Please try refreshing the page.";
      case "runtime":
        return "The application encountered an unexpected error. This has been logged and we're working on a fix.";
      case "boundary":
        return "A component failed to render properly. This is likely a temporary issue.";
      default:
        return "We encountered an unexpected error. Don't worry, this has been logged and we're working on it.";
    }
  };

  const getErrorVariant = () => {
    switch (errorType) {
      case "network":
        return "warning";
      case "chunk":
        return "info";
      case "runtime":
        return "destructive";
      case "boundary":
        return "secondary";
      default:
        return "destructive";
    }
  };

  const shouldShowAutoRetry = errorType === "network" || errorType === "chunk";

  return (
    <div className={cn(
      styles.errorContainer,
      styles[level],
      level === "page" && "min-h-screen"
    )}>
      <Card className={cn(styles.errorCard, styles[level])}>
        <CardHeader className={styles.errorHeader}>
          <div className={cn(styles.errorIcon, styles[errorType])}>
            {getErrorIcon()}
          </div>
          <CardTitle className={styles.errorTitle}>
            {getErrorTitle()}
          </CardTitle>
          <Badge variant={getErrorVariant() as any} className={styles.errorBadge}>
            {errorType.charAt(0).toUpperCase() + errorType.slice(1)} Error
          </Badge>
          {name && (
            <p className={styles.errorSource}>
              in {name}
            </p>
          )}
        </CardHeader>
        
        <CardContent className={styles.errorContent}>
          <p className={styles.errorMessage}>
            {getErrorMessage()}
          </p>
          
          {retryCount > 0 && (
            <div className={styles.retryInfo}>
              <Info className="h-4 w-4" />
              <span>Attempted {retryCount} {retryCount === 1 ? 'retry' : 'retries'}</span>
            </div>
          )}

          {process.env.NODE_ENV === "development" && (
            <details className={styles.errorDetails}>
              <summary className={styles.errorDetailsSummary}>
                Error Details (Development)
              </summary>
              <div className={styles.errorDetailsContent}>
                <div className={styles.errorStack}>
                  <strong>Error:</strong> {error.message}
                </div>
                <div className={styles.errorStack}>
                  <strong>Stack:</strong>
                  <pre>{error.stack}</pre>
                </div>
                {errorInfo && (
                  <div className={styles.errorStack}>
                    <strong>Component Stack:</strong>
                    <pre>{errorInfo.componentStack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <div className={styles.errorActions}>
            {showRetry && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={resetError}
                className={styles.primaryAction}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            
            {shouldShowAutoRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => retryWithDelay(2000)}
                className={styles.secondaryAction}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Auto Retry (2s)
              </Button>
            )}
            
            {showReload && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                className={styles.secondaryAction}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
            )}
            
            {showHome && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/'}
                className={styles.secondaryAction}
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            )}
            
            {showBack && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.history.back()}
                className={styles.secondaryAction}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Enhanced Error Boundary Hook
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

// Specialized Error Boundaries
export function PageErrorBoundary({ children, ...props }: Omit<ErrorBoundaryProps, 'level'>) {
  return (
    <EnhancedErrorBoundaryClass 
      level="page" 
      showHome={true}
      showBack={true}
      {...props}
    >
      {children}
    </EnhancedErrorBoundaryClass>
  );
}

export function SectionErrorBoundary({ children, ...props }: Omit<ErrorBoundaryProps, 'level'>) {
  return (
    <EnhancedErrorBoundaryClass 
      level="section"
      showRetry={true}
      showReload={false}
      {...props}
    >
      {children}
    </EnhancedErrorBoundaryClass>
  );
}

export function ComponentErrorBoundary({ children, ...props }: Omit<ErrorBoundaryProps, 'level'>) {
  return (
    <EnhancedErrorBoundaryClass 
      level="component"
      showRetry={true}
      showReload={false}
      showHome={false}
      showBack={false}
      {...props}
    >
      {children}
    </EnhancedErrorBoundaryClass>
  );
}

export function EnhancedErrorBoundary({ children, ...props }: ErrorBoundaryProps) {
  return (
    <EnhancedErrorBoundaryClass {...props}>
      {children}
    </EnhancedErrorBoundaryClass>
  );
}

export { EnhancedErrorFallback };

// Legacy export for backward compatibility
export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <EnhancedErrorBoundaryClass fallback={fallback}>
      {children}
    </EnhancedErrorBoundaryClass>
  );
} 