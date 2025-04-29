import React from "react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Package, Clock, Calendar, MapPin, Phone, Mail, User, Home } from "lucide-react";
import Navbar from "@/components/ui/navbar";
import { imageUrls } from "../lib/image-urls";

// Temporary mock data until we have real backend integration
const mockCartItems = [
  {
    id: 1,
    name: "Executive Office Chair",
    category: "Office",
    image: imageUrls.officeChairImage,
    price: 1800,
    duration: 3,
    totalPrice: 5400
  },
  {
    id: 2,
    name: "L-Shaped Sofa",
    category: "Living Room",
    image: imageUrls.lShapedSofaImage,
    price: 2500,
    duration: 2,
    totalPrice: 5000
  }
];

const mockRentals = [
  {
    id: 101,
    name: "Double Bed",
    category: "Bedroom",
    image: imageUrls.doubleBedImage,
    startDate: "15 Mar 2025",
    endDate: "15 Jun 2025",
    status: "active",
    price: 3000,
    totalPaid: 9000
  },
  {
    id: 102,
    name: "Dining Table Set",
    category: "Dining",
    image: imageUrls.diningTableSetImage,
    startDate: "10 Jan 2025",
    endDate: "10 Apr 2025",
    status: "completed",
    price: 2200,
    totalPaid: 6600
  }
];

export default function Dashboard() {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+880 1234 567890",
    address: "123 Green Road",
    city: "Dhaka",
    country: "Bangladesh"
  };

  // Calculate cart totals
  const cartTotal = mockCartItems.reduce((total, item) => total + item.totalPrice, 0);
  const cartItemCount = mockCartItems.length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* User Profile Sidebar */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-6 w-6 mr-2" />
                  My Account
                </CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-md">
                    <h3 className="font-semibold">{user.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Phone className="h-4 w-4 mr-1" />
                      {user.phone}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-2">SHIPPING ADDRESS</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-1 mt-0.5" />
                        <span>{user.address}, {user.city}, {user.country}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <Tabs defaultValue="rentals" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="rentals" className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  My Rentals
                </TabsTrigger>
                <TabsTrigger value="cart" className="flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart ({cartItemCount})
                </TabsTrigger>
              </TabsList>
              
              {/* Rentals Tab */}
              <TabsContent value="rentals" className="pt-6">
                <div className="grid gap-6">
                  <h2 className="text-2xl font-bold">My Rentals</h2>
                  
                  {mockRentals.length > 0 ? (
                    <div className="grid gap-4">
                      {mockRentals.map((rental) => (
                        <Card key={rental.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/4 h-40 md:h-auto">
                              <img
                                src={rental.image}
                                alt={rental.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-semibold">{rental.name}</h3>
                                  <p className="text-gray-500 text-sm">{rental.category}</p>
                                </div>
                                <Badge
                                  variant={rental.status === "active" ? "default" : "secondary"}
                                >
                                  {rental.status === "active" ? "Active" : "Completed"}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                  <p className="text-sm text-gray-500 flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Start Date
                                  </p>
                                  <p className="font-medium">{rental.startDate}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    End Date
                                  </p>
                                  <p className="font-medium">{rental.endDate}</p>
                                </div>
                              </div>
                              
                              <Separator className="my-4" />
                              
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm text-gray-500">Monthly Rate</p>
                                  <p className="font-semibold">৳ {rental.price}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Total Paid</p>
                                  <p className="font-semibold">৳ {rental.totalPaid}</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg bg-white">
                      <Package className="h-12 w-12 mx-auto text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium">No Rentals Yet</h3>
                      <p className="mt-2 text-gray-500">Start browsing our collection to rent furniture</p>
                      <Button className="mt-4" asChild>
                        <Link href="/products">Browse Products</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Cart Tab */}
              <TabsContent value="cart" className="pt-6">
                <div className="grid gap-6">
                  <h2 className="text-2xl font-bold">My Cart</h2>
                  
                  {mockCartItems.length > 0 ? (
                    <div className="grid gap-4">
                      {mockCartItems.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/4 h-40 md:h-auto">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-semibold">{item.name}</h3>
                                  <p className="text-gray-500 text-sm">{item.category}</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                  Remove
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                  <p className="text-sm text-gray-500">Monthly Rate</p>
                                  <p className="font-medium">৳ {item.price}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Rental Duration
                                  </p>
                                  <p className="font-medium">{item.duration} {item.duration === 1 ? 'month' : 'months'}</p>
                                </div>
                              </div>
                              
                              <Separator className="my-4" />
                              
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm text-gray-500">Subtotal</p>
                                  <p className="font-semibold">৳ {item.totalPrice}</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {mockCartItems.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.name} (x{item.duration} months)</span>
                                <span>৳ {item.totalPrice}</span>
                              </div>
                            ))}
                            
                            <Separator className="my-2" />
                            
                            <div className="flex justify-between font-medium">
                              <span>Total</span>
                              <span>৳ {cartTotal}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full">Proceed to Checkout</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg bg-white">
                      <ShoppingCart className="h-12 w-12 mx-auto text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium">Your Cart is Empty</h3>
                      <p className="mt-2 text-gray-500">Add items to your cart to proceed</p>
                      <Button className="mt-4" asChild>
                        <Link href="/products">Browse Products</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}