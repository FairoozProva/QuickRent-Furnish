import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { extendRental } from "@/lib/api";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";


type RentalCardProps = {
  rental: {
    _id: string;
    startDate: string;
    endDate: string;
    duration: number;
    totalAmount: number;
    status: string;
    product: {
      _id: string;
      name: string;
      price: number;
      imageUrl: string;
      material?: string;
    };
  };
};

export default function RentalCard({ rental }: RentalCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [extensionDuration, setExtensionDuration] = useState("3");
  const [isExtending, setIsExtending] = useState(false);
  
  const startDate = new Date(rental.startDate);
  const endDate = new Date(rental.endDate);
  
  // Format dates
  const formattedStartDate = format(startDate, "MMM d, yyyy");
  const formattedEndDate = format(endDate, "MMM d, yyyy");
  
  // Extend rental mutation
  const extendMutation = useMutation({
    mutationFn: () => extendRental(rental._id, parseInt(extensionDuration)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rentals'] });
      toast({
        title: 'Rental extended',
        description: `Your rental for ${rental.product.name} has been extended by ${extensionDuration} months.`,
      });
      setIsExtending(false);
    },
    onError: (error) => {
      toast({
        title: 'Extension failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleExtend = () => {
    extendMutation.mutate();
  };

  const getStatusBadgeClass = () => {
    switch (rental.status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'signed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
            <img
              src={rental.product.imageUrl}
              alt={rental.product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{rental.product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{rental.product.material}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass()}`}>
                {rental.status}
              </span>
            </div>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-6">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span>Start: {formattedStartDate}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span>End: {formattedEndDate}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span>Duration: {rental.duration} months</span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div>
                <span className="text-lg font-bold text-gray-900">₹{rental.totalAmount}</span>
              </div>
              
              <div className="flex space-x-2">
                {rental.status === 'active' && !isExtending && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsExtending(true)}
                  >
                    Extend Rental
                  </Button>
                )}
                
                {rental.status === 'pending' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <Link href={`/rental/${rental._id}/agreement`}>
                      Sign Agreement
                    </Link>
                  </Button>
                )}
                
                {isExtending && (
                  <div className="flex items-center space-x-2">
                    <Select value={extensionDuration} onValueChange={setExtensionDuration}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Month</SelectItem>
                        <SelectItem value="3">3 Months</SelectItem>
                        <SelectItem value="6">6 Months</SelectItem>
                        <SelectItem value="12">12 Months</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      size="sm"
                      onClick={handleExtend}
                      disabled={extendMutation.isPending}
                    >
                      Confirm
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsExtending(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
