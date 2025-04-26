import MainLayout from "@/components/layout/main-layout";
import Hero from "@/components/home/hero";
import Categories from "@/components/home/categories";
import TrendingProducts from "@/components/home/trending-products";
import NewArrivals from "@/components/home/new-arrivals";
import HowItWorks from "@/components/home/how-it-works";
import Testimonials from "@/components/home/testimonials";

export default function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <Categories />
      <TrendingProducts />
      <NewArrivals />
      <HowItWorks />
      <Testimonials />
    </MainLayout>
  );
}
