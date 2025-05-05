import React from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Package, Clock, Calendar, MapPin, Phone, Mail, User } from "lucide-react";
import Navbar from "@/components/ui/navbar";

// Types
interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
  };
  duration: number;
}

interface Rental {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
  };
  startDate: string;
  endDate: string;
  duration: number;
  totalAmount: number;
  status: string;
}

// Extend the base User type from auth
interface ExtendedUser {
  _id: string;
  username: string;
  name: string;
  email: string;
  createdAt: string;
  phone?: string;
  address?: string;
}

export default function Dashboard() {
  const { user: traditionalUser } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();
  const user = traditionalUser || firebaseUser;
  const currentUser = user as ExtendedUser;

  // Fetch cart items
  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ['/api/cart'],
    enabled: !!user,
  });

  // Fetch rentals
  const { data: rentals = [] } = useQuery<Rental[]>({
    queryKey: ['/api/rentals'],
    enabled: !!user,
  });

  // Calculate cart totals
  const cartTotal = cartItems.reduce((total: number, item: CartItem) => 
    total + (item.product.price * item.duration), 0);
  const cartItemCount = cartItems.length;

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-1 container mx-auto py-8 px-4 md:px-6 flex items-center justify-center">
          <Card>
            <CardContent className="py-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
              <p className="text-gray-500 mb-4">You need to be logged in to view your dashboard</p>
              <Button asChild>
                <Link href="/firebase-auth">Go to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                    <h3 className="font-semibold">{currentUser.name || currentUser.username}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      {currentUser.email}
                    </div>
                    {currentUser.phone && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Phone className="h-4 w-4 mr-1" />
                        {currentUser.phone}
                      </div>
                    )}
                  </div>
                  
                  {currentUser.address && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-2">SHIPPING ADDRESS</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-1 mt-0.5" />
                          <span>{currentUser.address}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/profile">Edit Profile</Link>
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
                  
                  {rentals.length > 0 ? (
                    <div className="grid gap-4">
                      {rentals.map((rental) => (
                        <Card key={rental._id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/4 h-40 md:h-auto">
                              <img
                                src={rental.product.imageUrl}
                                alt={rental.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-semibold">{rental.product.name}</h3>
                                  <p className="text-gray-500 text-sm">{rental.product.category}</p>
                                </div>
                                <Badge
                                  variant={rental.status === "active" ? "default" : "secondary"}
                                >
                                  {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                  <p className="text-sm text-gray-500 flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Start Date
                                  </p>
                                  <p className="font-medium">{new Date(rental.startDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    End Date
                                  </p>
                                  <p className="font-medium">{new Date(rental.endDate).toLocaleDateString()}</p>
                                </div>
                              </div>
                              
                              <Separator className="my-4" />
                              
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm text-gray-500">Monthly Rate</p>
                                  <p className="font-semibold">৳ {rental.product.price}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Total Paid</p>
                                  <p className="font-semibold">৳ {rental.totalAmount}</p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/rentals/${rental._id}`}>View Details</Link>
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
                  
                  {cartItems.length > 0 ? (
                    <div className="grid gap-4">
                      {cartItems.map((item) => (
                        <Card key={item._id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/4 h-40 md:h-auto">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-semibold">{item.product.name}</h3>
                                  <p className="text-gray-500 text-sm">{item.product.category}</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  Remove
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                  <p className="text-sm text-gray-500">Monthly Rate</p>
                                  <p className="font-medium">৳ {item.product.price}</p>
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
                                  <p className="font-semibold">৳ {item.product.price * item.duration}</p>
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
                            {cartItems.map((item) => (
                              <div key={item._id} className="flex justify-between text-sm">
                                <span>{item.product.name} (x{item.duration} months)</span>
                                <span>৳ {item.product.price * item.duration}</span>
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
                          <Button className="w-full" asChild>
                            <Link href="/checkout">Proceed to Checkout</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg bg-white">
                      <ShoppingCart className="h-12 w-12 mx-auto text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium">Your Cart is Empty</h3>
                      <p className="mt-2 text-gray-500">Browse our collection to add items to your cart</p>
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