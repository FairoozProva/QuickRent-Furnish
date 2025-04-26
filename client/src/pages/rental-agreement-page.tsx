import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { fetchRentalAgreement, signRentalAgreement } from "@/lib/api";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle, FileText, CreditCard, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type RentalAgreement = {
  rental: {
    _id: string;
    startDate: string;
    endDate: string;
    duration: number;
    totalAmount: number;
    status: string;
  };
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    sku: string;
    description: string;
    material?: string;
    dimensions?: string;
    color?: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
};

export default function RentalAgreementPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  
  // Fetch rental agreement
  const { 
    data: agreement, 
    isLoading, 
    error 
  } = useQuery<RentalAgreement>({
    queryKey: [`/api/rentals/${id}/agreement`],
    queryFn: () => fetchRentalAgreement(id),
  });
  
  // Sign agreement mutation
  const signMutation = useMutation({
    mutationFn: () => signRentalAgreement(id, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rentals'] });
      
      toast({
        title: 'Agreement signed',
        description: 'Your rental agreement has been successfully signed and processed.',
      });
      
      navigate('/rentals');
    },
    onError: (error) => {
      toast({
        title: 'Signing failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const handleSign = () => {
    if (!acceptedTerms) {
      toast({
        title: 'Terms not accepted',
        description: 'Please accept the terms and conditions to proceed.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!paymentMethod) {
      toast({
        title: 'Payment method required',
        description: 'Please select a payment method to proceed.',
        variant: 'destructive',
      });
      return;
    }
    
    signMutation.mutate();
  };
  
  // Format dates
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <div className="flex items-center text-amber-500 mb-2">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <CardTitle>Error Loading Agreement</CardTitle>
              </div>
              <CardDescription>
                We couldn't load your rental agreement. Please try again later or contact customer support.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <a href="/rentals">Return to Rentals</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <FileText className="h-8 w-8 mr-3 text-primary" />
          Rental Agreement
        </h1>
        
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Separator />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ) : agreement?.rental.status === 'signed' ? (
          <Card>
            <CardHeader className="bg-green-50 border-b border-green-100">
              <div className="flex items-center text-green-600 mb-2">
                <CheckCircle className="h-5 w-5 mr-2" />
                <CardTitle>Agreement Already Signed</CardTitle>
              </div>
              <CardDescription>
                This rental agreement has already been signed and processed.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Agreement Details</h3>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    Rental for {agreement.product.name}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {agreement.rental.duration} months
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      ৳{agreement.rental.totalAmount + 1000} Taka
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {formatDate(agreement.rental.startDate)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {formatDate(agreement.rental.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 bg-gray-50 border-t">
              <Button asChild>
                <a href="/rentals">Return to Rentals</a>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <div className="flex items-center text-amber-600 mb-2">
                <FileText className="h-5 w-5 mr-2" />
                <CardTitle>Rental Agreement</CardTitle>
              </div>
              <CardDescription>
                Please review this agreement carefully before signing.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={agreement?.product.imageUrl} 
                      alt={agreement?.product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{agreement?.product.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {agreement?.product.sku}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Renter</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {agreement?.user.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {agreement?.user.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {formatDate(agreement!.rental.startDate)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {formatDate(agreement!.rental.endDate)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {agreement?.rental.duration} months
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Monthly Amount</h3>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      ৳{agreement?.product.price + 1000} Taka/month
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Product Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    {agreement?.product.dimensions && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Dimensions</h4>
                        <p className="text-sm text-gray-700">{agreement.product.dimensions}</p>
                      </div>
                    )}
                    {agreement?.product.color && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Color</h4>
                        <p className="text-sm text-gray-700">{agreement.product.color}</p>
                      </div>
                    )}
                    {agreement?.product.material && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Material</h4>
                        <p className="text-sm text-gray-700">{agreement.product.material}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Payment Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Monthly Rental</span>
                      <span className="text-gray-900">৳{agreement?.product.price + 1000}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Duration</span>
                      <span className="text-gray-900">{agreement?.rental.duration} months</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Delivery & Setup</span>
                      <span className="text-gray-900">Free</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900">Total Amount</span>
                      <span className="text-primary">৳{agreement?.rental.totalAmount + 1000}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Select Payment Method</h3>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="debit-card">Debit Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="net-banking">Net Banking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
                  <div className="text-sm text-gray-600 space-y-2 h-32 overflow-y-auto p-2 border border-gray-200 rounded bg-white mb-4">
                    <p>1. The rental period begins on the delivery date and ends on the specified end date.</p>
                    <p>2. Payment is due at the beginning of each rental period.</p>
                    <p>3. The renter is responsible for maintaining the furniture in good condition.</p>
                    <p>4. Normal wear and tear is expected and accepted.</p>
                    <p>5. Significant damage beyond normal wear and tear may result in additional charges.</p>
                    <p>6. The renter may extend the rental period by contacting FurnishRent before the end date.</p>
                    <p>7. Early termination fees may apply if the rental is canceled before the end date.</p>
                    <p>8. FurnishRent will handle delivery, assembly, and pickup at no additional cost.</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-700">
                      I have read and agree to the terms and conditions
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 bg-gray-50 border-t">
              <Button 
                variant="outline" 
                asChild
              >
                <a href="/rentals">Cancel</a>
              </Button>
              <Button 
                onClick={handleSign}
                disabled={signMutation.isPending || !acceptedTerms || !paymentMethod}
              >
                {signMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Sign & Pay
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
