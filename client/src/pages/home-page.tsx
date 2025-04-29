import MainLayout from "@/components/layout/main-layout";
import Hero from "@/components/home/hero";
import TrendingProducts from "@/components/home/trending-products";
import NewArrivals from "@/components/home/new-arrivals";
import HowItWorks from "@/components/home/how-it-works";
import { Categories } from "@/components/home/categories";

export default function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <Categories />
      <TrendingProducts />
      <NewArrivals />
      <HowItWorks />
    </MainLayout>
  );
}
