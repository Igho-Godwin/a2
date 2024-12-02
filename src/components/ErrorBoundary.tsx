import React, { Component, ErrorInfo } from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error caught by boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="p-4 border border-red-200 bg-red-50 rounded-lg"
        >
          <h2 className="text-lg font-semibold text-red-700">
            Something went wrong
          </h2>
          <p className="mt-2 text-red-600">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
