import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ProductCard from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  material: string;
  categoryId: string;
  isNewArrival: boolean;
};

export default function NewArrivals() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products/new-arrivals'],
  });

  if (error) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">New Arrivals</h2>
            <p className="mt-4 text-lg text-red-500">Error loading new arrivals. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">New Arrivals</h2>
            <p className="mt-4 text-lg text-gray-500">Fresh furniture just added to our collection</p>
          </div>
          <Link href="/products?new=true" className="hidden sm:flex text-primary hover:text-primary-600 font-medium items-center">
            View all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Skeleton className="w-full h-56" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            products?.map((product) => (
              <ProductCard key={product._id} product={product} showNewBadge={true} />
            ))
          )}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link href="/products?new=true" className="inline-flex items-center text-primary hover:text-primary-600 font-medium">
            View all new arrivals <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
