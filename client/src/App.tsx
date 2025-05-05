import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { FirebaseAuthProvider } from "@/hooks/use-firebase-auth";
import { Toaster } from "@/components/ui/toaster";

// Import our pages
import HomePage from "./pages/home-page";
import ProductsPage from "./pages/products-page";
import CategoriesPage from "./pages/categories-page";
import CategoryPage from "./pages/category-page";
import ProductDetailPage from "./pages/product-detail-page";
import Dashboard from "./pages/dashboard";
import HowItWorksPage from "./pages/how-it-works-page";
import AuthPage from "./pages/auth-page";
import NotFound from "./pages/not-found";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseAuthProvider>
        <AuthProvider>
          <div>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/products" component={ProductsPage} />
              <Route path="/categories" component={CategoriesPage} />
              <Route path="/category/:slug" component={CategoryPage} />
              <Route path="/product/:slug" component={ProductDetailPage} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/how-it-works" component={HowItWorksPage} />
              <Route path="/auth" component={AuthPage} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Toaster />
        </AuthProvider>
      </FirebaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
