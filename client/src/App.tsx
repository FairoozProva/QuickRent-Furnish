import { Switch, Route, Link } from "wouter";

// Simple page components for testing navigation
function SimplePage({ title }: { title: string }) {
  return (
    <div style={{ padding: "20px" }}>
      <h1>{title}</h1>
      <SimpleNavigation />
    </div>
  );
}

function SimpleNavigation() {
  return (
    <nav style={{ marginBottom: "20px" }}>
      <ul style={{ display: "flex", gap: "20px", listStyle: "none", padding: 0 }}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/categories">Categories</Link></li>
        <li><Link href="/how-it-works">How It Works</Link></li>
      </ul>
    </nav>
  );
}

function HomePage() {
  return <SimplePage title="Home Page" />;
}

function ProductsPage() {
  return <SimplePage title="Products Page" />;
}

function CategoriesPage() {
  return <SimplePage title="Categories Page" />;
}

function HowItWorksPage() {
  return <SimplePage title="How It Works Page" />;
}

function NotFound() {
  return <SimplePage title="404 - Page Not Found" />;
}

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
