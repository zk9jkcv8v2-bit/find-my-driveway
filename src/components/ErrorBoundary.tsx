import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex-1 flex items-center justify-center bg-secondary">
          <div className="flex flex-col items-center gap-2 text-center px-8">
            <p className="text-sm font-medium text-muted-foreground">Something went wrong</p>
            <p className="text-xs text-muted-foreground/70">Try refreshing the page</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
