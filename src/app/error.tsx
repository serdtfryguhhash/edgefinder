"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          An unexpected error occurred. Our team has been notified and is working on a fix.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="default">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-muted-foreground mt-4 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
