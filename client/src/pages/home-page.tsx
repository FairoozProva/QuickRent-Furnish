import MainLayout from "@/components/layout/main-layout";
import Hero from "@/components/home/hero";
import TrendingProducts from "@/components/home/trending-products";
import NewArrivals from "@/components/home/new-arrivals";
import HowItWorks from "@/components/home/how-it-works";

export default function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <TrendingProducts />
      <NewArrivals />
      <HowItWorks />
    </MainLayout>
  );
}
