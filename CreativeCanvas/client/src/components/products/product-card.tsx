import { useState } from "react";
import { Link } from "wouter";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { addToWishlist, removeFromWishlist, addToCart, checkWishlist, checkCart } from "@/lib/api";
import { Button } from "@/components/ui/button";

type ProductCardProps = {
  product: {
    _id: string;
    name: string;
    price: number;
    material?: string;
    imageUrl: string;
    isNewArrival?: boolean;
  };
  showNewBadge?: boolean;
};

export default function ProductCard({ product, showNewBadge = false }: ProductCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check if product is in wishlist
  const { data: wishlistData } = useQuery({
    queryKey: [`/api/wishlist/check/${product._id}`],
    enabled: !!user && !!product._id,
  });
  
  // Check if product is in cart
  const { data: cartData } = useQuery({
    queryKey: [`/api/cart/check/${product._id}`],
    enabled: !!user && !!product._id,
  });

  const isInWishlist = wishlistData?.isInWishlist || false;
  const isInCart = cartData?.isInCart || false;

  // Add to wishlist mutation
  const wishlistMutation = useMutation({
    mutationFn: isInWishlist 
      ? () => removeFromWishlist(product._id)
      : () => addToWishlist(product._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      queryClient.invalidateQueries({ queryKey: [`/api/wishlist/check/${product._id}`] });
      
      toast({
        title: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
        description: isInWishlist 
          ? `${product.name} has been removed from your wishlist.`
          : `${product.name} has been added to your wishlist.`,
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
    mutationFn: () => addToCart(product._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      queryClient.invalidateQueries({ queryKey: [`/api/cart/check/${product._id}`] });
      
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
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

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-56 object-cover object-center"
        />
        {showNewBadge && product.isNewArrival && (
          <div className="absolute top-0 left-0 m-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              New
            </span>
          </div>
        )}
        <div className="absolute top-0 right-0 m-2 flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1.5 rounded-full bg-white shadow hover:bg-gray-100"
            onClick={handleWishlistClick}
            disabled={wishlistMutation.isPending}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1.5 rounded-full bg-white shadow hover:bg-gray-100"
            onClick={handleCartClick}
            disabled={cartMutation.isPending}
          >
            <ShoppingCart className={`h-4 w-4 ${isInCart ? 'fill-primary text-primary' : 'text-gray-600'}`} />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{product.material}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
            <span className="text-sm text-gray-600">/month</span>
          </div>
          <Link href={`/product/${product._id}`} className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-600">
            Details <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
