import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import ProductCard from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/lib/api";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  material: string;
  categoryId: string;
};

export default function TrendingProducts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products/trending'],
    queryFn: async () => {
      const response = await fetch('/api/products/trending');
      if (!response.ok) throw new Error('Failed to fetch trending products');
      return response.json();
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => addToCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: 'Added to cart',
        description: 'Item has been added to your cart.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to add to cart',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleAddToCart = (productId: string, productName: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add items to your cart.',
        variant: 'destructive',
      });
      return;
    }
    
    addToCartMutation.mutate(productId);
  };

  // Add new trending products
  const trendingProducts = [
    { id: '1', imageUrl: '/src/assets/Bed 1.jpeg', name: 'Storage Bed', price: 700 },
    { id: '2', imageUrl: '/src/assets/Neutral Office Chair.jpeg', name: 'Neutral Office Chair', price: 500 },
    { id: '3', imageUrl: '/src/assets/Study Table 6.jpeg', name: 'Wooden Study Table', price: 300 },
  ];

  if (error) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Trending Now</h2>
            <p className="mt-4 text-lg text-red-500">Error loading trending products. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Trending Now</h2>
            <p className="mt-4 text-lg text-gray-500">Our most popular pieces this month</p>
          </div>
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
            products?.length ? (
              products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">৳{product.price}/month</p>
                    <Button 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => handleAddToCart(product._id, product.name)}
                      disabled={addToCartMutation.isPending}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              trendingProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">৳{product.price}/month</p>
                    <Button 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => handleAddToCart(product.id, product.name)}
                      disabled={addToCartMutation.isPending}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}
