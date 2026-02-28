import Link from "next/link";
import { Activity, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <Activity className="h-6 w-6 text-accent" />
          </div>
          <span className="text-2xl font-bold">
            Edge<span className="text-accent">Finder</span>
          </span>
        </div>
        <p className="text-7xl font-bold data-text text-accent mb-4">404</p>
        <h2 className="text-2xl font-bold mb-2">Page not found</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="glow">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
