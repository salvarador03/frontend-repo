import React from "react";
import PaginaErrorInterno from "../common/PaginasError/PaginaErrorInterno";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary", error, errorInfo);
    console.log("Component stack trace", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <PaginaErrorInterno />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
