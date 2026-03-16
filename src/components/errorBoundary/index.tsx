import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
    /** Child components */
    children: ReactNode;

    /** Optional fallback UI to display on error */
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    /** Whether an error has been caught */
    hasError: boolean;

    /** The caught error */
    error?: Error;
}

/** Error boundary component to catch rendering errors and display fallback UI */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="container mt-6">
                    <article className="message is-warning">
                        <div className="message-header">
                            <p>
                                <span className="icon mr-2">
                                    <i className="bi bi-exclamation-triangle" />
                                </span>
                                Unable to load the page
                            </p>
                        </div>
                        <div className="message-body">
                            <p className="mb-4">
                                An unexpected error occurred while rendering the content.
                                Please try refreshing the page.
                            </p>
                            {this.state.error && (
                                <p className="is-size-7 has-text-grey mb-4">
                                    {this.state.error.message}
                                </p>
                            )}
                            <button
                                className="button is-warning is-outlined"
                                onClick={() => window.location.reload()}
                            >
                                <span className="icon">
                                    <i className="bi bi-arrow-clockwise" />
                                </span>
                                <span>Reload page</span>
                            </button>
                        </div>
                    </article>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
