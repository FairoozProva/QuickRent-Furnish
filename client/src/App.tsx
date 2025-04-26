import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { FirebaseAuthProvider } from "@/hooks/use-firebase-auth";
import { ProtectedRoute } from "./lib/protected-route";

// Pages
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import FirebaseAuthPage from "@/pages/firebase-auth-page";
import ProductsPage from "@/pages/products-page";
import ProductDetailPage from "@/pages/product-detail-page";
import CartPage from "@/pages/cart-page";
import WishlistPage from "@/pages/wishlist-page";
import CategoryPage from "@/pages/category-page";
import HowItWorksPage from "@/pages/how-it-works-page";
import RentalsPage from "@/pages/rentals-page";
import RentalAgreementPage from "@/pages/rental-agreement-page";
import AboutPage from "@/pages/about-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      {/* Traditional MongoDB auth */}
      <Route path="/auth" component={AuthPage} />
      {/* Firebase auth */}
      <Route path="/firebase-auth" component={FirebaseAuthPage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/product/:id" component={ProductDetailPage} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/how-it-works" component={HowItWorksPage} />
      <Route path="/about" component={AboutPage} />
      
      {/* Protected routes - can work with either auth system */}
      <ProtectedRoute path="/cart" component={CartPage} />
      <ProtectedRoute path="/wishlist" component={WishlistPage} />
      <ProtectedRoute path="/rentals" component={RentalsPage} />
      <ProtectedRoute path="/rental/:id/agreement" component={RentalAgreementPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Wrap with both auth providers - traditional MongoDB auth first */}
        <AuthProvider>
          {/* Firebase Auth provider for Firebase auth integration */}
          <FirebaseAuthProvider>
            <Toaster />
            <Router />
          </FirebaseAuthProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
