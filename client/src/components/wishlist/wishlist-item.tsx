import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { removeFromWishlist, addToCart } from "@/lib/api";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type WishlistItemProps = {
  item: {
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
};

export default function WishlistItem({ item }: WishlistItemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Remove from wishlist mutation
  const removeMutation = useMutation({
    mutationFn: () => removeFromWishlist(item.productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      toast({
        title: 'Item removed',
        description: `${item.product.name} has been removed from your wishlist.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Remove failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: () => addToCart(item.productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: 'Added to cart',
        description: `${item.product.name} has been added to your cart.`,
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

  const handleRemove = () => {
    removeMutation.mutate();
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-6 border-b border-gray-200">
      <div className="md:col-span-2 flex items-center">
        <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="ml-4 flex-1 flex flex-col">
          <div>
            <div className="flex justify-between">
              <Link href={`/product/${item.product._id}`}>
                <h3 className="text-base font-medium text-gray-900 hover:text-primary">
                  {item.product.name}
                </h3>
              </Link>
            </div>
            <p className="mt-1 text-sm text-gray-500">{item.product.material}</p>
          </div>
        </div>
      </div>

      <div className="md:col-span-1 flex items-center">
        <span className="text-base font-medium text-gray-900">
          ₹{item.product.price}/mo
        </span>
      </div>

      <div className="md:col-span-2 flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending}
          className="flex items-center"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRemove}
          disabled={removeMutation.isPending}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remove
        </Button>
      </div>
    </div>
  );
}
