import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Home() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to dashboard
    navigate("/dashboard");
  }, [navigate]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to FeedbackIQ</h1>
          <p className="text-xl mb-8">
            Collect, analyze, and act on customer feedback with powerful sentiment analysis
          </p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
