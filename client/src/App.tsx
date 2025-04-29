import { Switch, Route } from "wouter";

// Import our pages
import HomePage from "./pages/home-page";
import ProductsPage from "./pages/products-page";
import CategoriesPage from "./pages/categories-page";
import CategoryPage from "./pages/category-page";
import HowItWorksPage from "./pages/how-it-works-page";
import AuthPage from "./pages/auth-page";
import NotFound from "./pages/not-found";

function App() {
  return (
    <div>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/products" component={ProductsPage} />
        <Route path="/categories" component={CategoriesPage} />
        <Route path="/category/:slug" component={CategoryPage} />
        <Route path="/how-it-works" component={HowItWorksPage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
