import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/main-layout";
import CartItem from "@/components/cart/cart-item";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchCart, clearCart, createRentals } from "@/lib/api";
import { ShoppingBag, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type CartItem = {
  _id: string;
  productId: string;
  duration: number;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
};

export default function CartPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Fetch cart items
  const { data: cartItems, isLoading, error } = useQuery<CartItem[]>({
    queryKey: ['/api/cart'],
  });
  
  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to clear cart',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const createRentalsMutation = useMutation({
    mutationFn: createRentals,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rentals'] });
      
      toast({
        title: 'Order placed',
        description: 'Your rental order has been placed successfully!',
      });
      
      navigate('/rentals');
    },
    onError: (error) => {
      toast({
        title: 'Failed to place order',
        description: error.message,
        variant: 'destructive',
      });
      setIsCheckingOut(false);
    },
  });
  
  const handleClearCart = () => {
    clearCartMutation.mutate();
  };
  
  const handleCheckout = () => {
    setIsCheckingOut(true);
    createRentalsMutation.mutate();
  };
  
  // Calculate totals
  const calculateSubtotal = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.duration);
    }, 0);
  };
  
  const subtotal = calculateSubtotal();
  const deliveryFee = subtotal > 0 ? 500 : 0;
  const total = subtotal + deliveryFee;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p>Failed to load cart items. Please try again later.</p>
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
                <Skeleton className="md:col-span-1 h-10" />
                <Skeleton className="md:col-span-1 h-6" />
                <Skeleton className="md:col-span-1 h-6" />
              </div>
            ))}
          </div>
        ) : cartItems?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400" />
            <h2 className="mt-4 text-xl font-medium text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">Looks like you haven't added any furniture to your cart yet.</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Cart Items ({cartItems?.length})</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClearCart}
                  disabled={clearCartMutation.isPending}
                >
                  Clear All
                </Button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems?.map(item => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
              
              <div className="mt-6">
                <Button
                  variant="outline"
                  asChild
                  className="flex items-center"
                >
                  <Link href="/products">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-20">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">৳{subtotal + 1000}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-900 font-medium">৳{deliveryFee + 1000}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-semibold">Total</span>
                    <span className="text-primary font-bold">৳{total + 1000}</span>
                  </div>
                </div>
                
                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || createRentalsMutation.isPending}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                <p className="mt-4 text-sm text-gray-500 text-center">
                  Free delivery and assembly included with all orders
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
