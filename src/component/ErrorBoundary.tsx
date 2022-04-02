import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Component to catch errors in its child component tree and show a meaningful error message.
 * 
 * @see https://reactjs.org/docs/error-boundaries.html
 * @see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/error_boundaries/
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service.
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    // Render custom fallback UI when state has error.
    if (this.state.hasError) {
      return (
      <p>
        I may be a computer, but my creator is just a normal human being and makes mistakes too!<br />
        So please reload the page and try again or <a href="https://github.com/AElmecker/sudokusolver/issues">create an issue.</a>
      </p>);
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
