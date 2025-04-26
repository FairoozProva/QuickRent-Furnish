import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ProductCard from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import axios from "axios"; // Import axios for API calls
import studyTableImg from '../../assets/Study Table 1.jpeg';
import sofaSetImg from '../../assets/Sofa Set 1.jpeg';
import bedImg from '../../assets/Bed 4.jpeg';

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
    queryFn: async () => {
      const response = await axios.get('http://localhost:5000/api/products/new-arrivals');
      return response.data || [];  // Ensure we always return an array
    },
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

  const availableProducts = Array.isArray(products) ? products : [];

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
            availableProducts.length > 0 ? (
              availableProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              [
                { id: '1', imageUrl: studyTableImg, name: 'White Study Table', price: 300 },
                { id: '2', imageUrl: sofaSetImg, name: 'Boho Sofa', price: 1000 },
                { id: '3', imageUrl: bedImg, name: 'Bed ER6456', price: 800 },
              ].map((placeholder) => (
                <div key={placeholder.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <img src={placeholder.imageUrl} alt={placeholder.name} className="w-full h-56 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{placeholder.name}</h3>
                    <p className="text-sm text-gray-500">৳{placeholder.price}</p>
                  </div>
                </div>
              ))
            )
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
