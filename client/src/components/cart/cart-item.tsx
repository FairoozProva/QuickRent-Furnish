import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { updateCartItem, removeFromCart } from "@/lib/api";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CartItemProps = {
  item: {
    _id: string;
    productId: string;
    duration: number;
    product: {
      _id: string;
      name: string;
      price: number;
      imageUrl: string;
      material?: string;
    };
  };
};

export default function CartItem({ item }: CartItemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [duration, setDuration] = useState(item.duration.toString());
  
  // Update cart item duration mutation
  const updateMutation = useMutation({
    mutationFn: () => updateCartItem(item.productId, parseInt(duration)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: 'Cart updated',
        description: `Duration for ${item.product.name} updated to ${duration} months.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
      // Reset to original duration if update fails
      setDuration(item.duration.toString());
    },
  });

  // Remove from cart mutation
  const removeMutation = useMutation({
    mutationFn: () => removeFromCart(item.productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: 'Item removed',
        description: `${item.product.name} has been removed from your cart.`,
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

  const handleDurationChange = (value: string) => {
    setDuration(value);
    updateMutation.mutate();
  };

  const handleRemove = () => {
    removeMutation.mutate();
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
          <div className="flex-1 flex items-end md:hidden">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRemove}
              disabled={removeMutation.isPending}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="md:col-span-1 flex items-center">
        <div className="flex items-center space-x-2">
          <Select value={duration} onValueChange={handleDurationChange}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Month</SelectItem>
              <SelectItem value="3">3 Months</SelectItem>
              <SelectItem value="6">6 Months</SelectItem>
              <SelectItem value="9">9 Months</SelectItem>
              <SelectItem value="12">12 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="md:col-span-1 flex items-center">
        <span className="text-base font-medium text-gray-900">
          ৳{item.product.price + 1000}/mo
        </span>
      </div>

      <div className="md:col-span-1 flex items-center justify-between">
        <span className="text-base font-medium text-gray-900">
          ৳{(item.product.price + 1000) * parseInt(duration)}
        </span>
        <div className="hidden md:block">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRemove}
            disabled={removeMutation.isPending}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
