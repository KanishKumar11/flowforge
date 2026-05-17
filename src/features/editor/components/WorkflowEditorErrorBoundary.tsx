"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class WorkflowEditorErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[WorkflowEditor] uncaught error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md px-4">
            <h2 className="text-lg font-mono uppercase">Editor crashed</h2>
            <p className="text-sm text-muted-foreground">
              An unexpected error occurred in the workflow editor. Your last
              saved state is preserved.
            </p>
            <pre className="text-xs text-left bg-muted p-3 rounded overflow-auto max-h-40">
              {this.state.error.message}
            </pre>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => this.setState({ error: null })}
              >
                Try again
              </Button>
              <Button asChild>
                <Link href="/workflows">Back to workflows</Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
