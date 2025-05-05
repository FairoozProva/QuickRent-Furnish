import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import RentalCard from "@/components/rentals/rental-card";
import { Button } from "@/components/ui/button";
import { fetchRentals } from "@/lib/api";
import { Package2, Loader2, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

type Rental = {
  _id: string;
  startDate: string;
  endDate: string;
  duration: number;
  totalAmount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'signed';
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    material?: string;
  };
};

export default function RentalsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Fetch rentals
  const { data: rentals, isLoading, error } = useQuery<Rental[]>({
    queryKey: ['/api/rentals'],
  });
  
  
  const filteredRentals = rentals?.filter(rental => {
    if (activeTab === "all") return true;
    return rental.status === activeTab;
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Rentals</h1>
          
          <Button
            variant="outline"
            asChild
          >
            <Link href="/products">
              Browse More Products
            </Link>
          </Button>
        </div>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p>Failed to load rental items. Please try again later.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="w-full h-48 rounded-lg" />
            ))}
          </div>
        ) : rentals?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <Package2 className="h-16 w-16 mx-auto text-gray-400" />
            <h2 className="mt-4 text-xl font-medium text-gray-900">No rentals found</h2>
            <p className="mt-2 text-gray-500">You haven't rented any furniture yet.</p>
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
          <>
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <TabsList className="grid grid-cols-5 w-full max-w-md">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="signed">Signed</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-6">
              {filteredRentals?.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-xl font-medium text-gray-900">No {activeTab} rentals</h2>
                  <p className="mt-2 text-gray-500">You don't have any {activeTab} rentals at the moment.</p>
                </div>
              ) : (
                filteredRentals?.map(rental => (
                  <RentalCard key={rental._id} rental={rental} />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
