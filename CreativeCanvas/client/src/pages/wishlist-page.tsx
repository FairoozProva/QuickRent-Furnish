import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import WishlistItem from "@/components/wishlist/wishlist-item";
import { Button } from "@/components/ui/button";
import { fetchWishlist } from "@/lib/api";
import { Heart, Loader2, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type WishlistItem = {
  _id: string;
  productId: string;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    material?: string;
  };
};

export default function WishlistPage() {
  // Fetch wishlist items
  const { data: wishlistItems, isLoading, error } = useQuery<WishlistItem[]>({
    queryKey: ['/api/wishlist'],
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          
          {wishlistItems && wishlistItems.length > 0 && (
            <Button
              variant="outline"
              asChild
            >
              <Link href="/products">
                Continue Shopping
              </Link>
            </Button>
          )}
        </div>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p>Failed to load wishlist items. Please try again later.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 py-6 border-b border-gray-200">
                <div className="md:col-span-2 flex items-center">
                  <Skeleton className="w-20 h-20 rounded-md" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-6 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="md:col-span-1 h-6" />
                <Skeleton className="md:col-span-2 h-10" />
              </div>
            ))}
          </div>
        ) : wishlistItems?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <Heart className="h-16 w-16 mx-auto text-gray-400" />
            <h2 className="mt-4 text-xl font-medium text-gray-900">Your wishlist is empty</h2>
            <p className="mt-2 text-gray-500">Save your favorite furniture pieces for later.</p>
            <Button 
              className="mt-6" 
              asChild
            >
              <Link href="/products">
                Browse Products
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="divide-y divide-gray-200">
              {wishlistItems?.map(item => (
                <WishlistItem key={item._id} item={item} />
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                asChild
              >
                <Link href="/products">
                  Continue Shopping
                </Link>
              </Button>
              
              <Button
                asChild
              >
                <Link href="/cart">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Cart
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
