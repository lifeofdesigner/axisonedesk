import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { reportClientError } from "@/core/error/report-client-error";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
    reportClientError(error.message, error.stack, { componentStack: info.componentStack ?? undefined });
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-lg font-semibold">Something went wrong</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            An unexpected error occurred while rendering this page. Try reloading — if the
            problem persists, contact support.
          </p>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
