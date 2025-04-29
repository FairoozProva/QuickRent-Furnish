import { Switch, Route } from "wouter";

// Import our pages
import HomePage from "./pages/home-page";
import ProductsPage from "./pages/products-page";
import CategoriesPage from "./pages/categories-page";
import HowItWorksPage from "./pages/how-it-works-page";
import NotFound from "./pages/not-found";

function App() {
  return (
    <div>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/products" component={ProductsPage} />
        <Route path="/categories" component={CategoriesPage} />
        <Route path="/how-it-works" component={HowItWorksPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
