import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

/**
 * A route that requires Firebase authentication
 * Redirects to /firebase-auth if user is not authenticated
 */
export function FirebaseProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useFirebaseAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/firebase-auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}