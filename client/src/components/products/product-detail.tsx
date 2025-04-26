import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { fetchProduct, fetchRelatedProducts, addToCart, addToWishlist, removeFromWishlist, checkWishlist, checkCart } from "@/lib/api";
import { Heart, ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";

type ProductDetailProps = {
  productId: string;
};

export default function ProductDetail({ productId }: ProductDetailProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [duration, setDuration] = useState("3");

  // Fetch product details
  const { 
    data: product, 
    isLoading: isLoadingProduct,
    error: productError
  } = useQuery({
    queryKey: [`/api/products/${productId}`],
    queryFn: () => fetchProduct(productId),
  });

  // Fetch related products
  const { 
    data: relatedProducts, 
    isLoading: isLoadingRelated,
    error: relatedError
  } = useQuery({
    queryKey: [`/api/products/${productId}/related`],
    queryFn: () => fetchRelatedProducts(productId),
    enabled: !!productId,
  });

  // Check if product is in wishlist
  const { data: wishlistData } = useQuery({
    queryKey: [`/api/wishlist/check/${productId}`],
    enabled: !!user && !!productId,
  });
  
  // Check if product is in cart
  const { data: cartData } = useQuery({
    queryKey: [`/api/cart/check/${productId}`],
    enabled: !!user && !!productId,
  });

  const isInWishlist = wishlistData?.isInWishlist || false;
  const isInCart = cartData?.isInCart || false;

  // Add to wishlist mutation
  const wishlistMutation = useMutation({
    mutationFn: isInWishlist 
      ? () => removeFromWishlist(productId)
      : () => addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist/check/${productId}`] });
      
      toast({
        title: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
        description: isInWishlist 
          ? `${product?.name} has been removed from your wishlist.`
          : `${product?.name} has been added to your wishlist.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Action failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Add to cart mutation
  const cartMutation = useMutation({
    mutationFn: () => addToCart(productId, parseInt(duration)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      queryClient.invalidateQueries({ queryKey: [`/api/cart/check/${productId}`] });
      
      toast({
        title: 'Added to cart',
        description: `${product?.name} has been added to your cart for ${duration} months.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Action failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleWishlistClick = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add items to your wishlist.',
        variant: 'destructive',
      });
      return;
    }
    
    wishlistMutation.mutate();
  };

  const handleCartClick = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add items to your cart.',
        variant: 'destructive',
      });
      return;
    }
    
    cartMutation.mutate();
  };

  if (productError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Error loading product</h2>
          <p className="mt-2 text-gray-500">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoadingProduct ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="w-full h-96 rounded-lg" />
            <div>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              <Skeleton className="h-24 w-full mb-6" />
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product?.imageUrl}
                alt={product?.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product?.name}</h1>
              <p className="mt-2 text-lg text-gray-600">{product?.material}</p>
              
              <div className="mt-6">
                <h2 className="sr-only">Product description</h2>
                <p className="text-base text-gray-700">{product?.description}</p>
              </div>
              
              <div className="mt-8">
                <div className="flex items-center">
                  <h2 className="text-lg font-medium text-gray-900">₹{product?.price}</h2>
                  <span className="ml-2 text-sm text-gray-500">/month</span>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Rental Duration
                  </label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="9">9 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col space-y-4">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleCartClick}
                  disabled={cartMutation.isPending}
                >
                  {cartMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-2 h-5 w-5" />
                  )}
                  Add to Cart
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleWishlistClick}
                  disabled={wishlistMutation.isPending}
                >
                  {wishlistMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className={`mr-2 h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  )}
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
              
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h2 className="text-sm font-medium text-gray-900">Product Details</h2>
                <dl className="mt-2 border-t border-gray-200">
                  {product?.sku && (
                    <div className="py-3 flex justify-between text-sm">
                      <dt className="text-gray-500">SKU</dt>
                      <dd className="font-medium text-gray-900">{product.sku}</dd>
                    </div>
                  )}
                  {product?.dimensions && (
                    <div className="py-3 flex justify-between text-sm border-t border-gray-200">
                      <dt className="text-gray-500">Dimensions</dt>
                      <dd className="font-medium text-gray-900">{product.dimensions}</dd>
                    </div>
                  )}
                  {product?.color && (
                    <div className="py-3 flex justify-between text-sm border-t border-gray-200">
                      <dt className="text-gray-500">Color</dt>
                      <dd className="font-medium text-gray-900">{product.color}</dd>
                    </div>
                  )}
                  {product?.material && (
                    <div className="py-3 flex justify-between text-sm border-t border-gray-200">
                      <dt className="text-gray-500">Material</dt>
                      <dd className="font-medium text-gray-900">{product.material}</dd>
                    </div>
                  )}
                  {product?.category && (
                    <div className="py-3 flex justify-between text-sm border-t border-gray-200">
                      <dt className="text-gray-500">Category</dt>
                      <dd className="font-medium text-gray-900">{product.category.name}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
          
          {relatedError ? (
            <p className="mt-4 text-red-500">Error loading related products.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoadingRelated ? (
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
                relatedProducts?.map((relatedProduct) => (
                  <ProductCard key={relatedProduct._id} product={relatedProduct} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
