import React, { useState } from "react";
import { useRoute, Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Heart,
  Clock, 
  TruckIcon, 
  RotateCcw, 
  Star, 
  CheckCircle2, 
  X, 
  Info, 
  Package,
  ChevronLeft
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/ui/navbar";
import { imageUrls } from "../lib/image-urls";

// Mock product details
const products = {
  "office-chair": {
    id: 1,
    sku: "OFC-EXC01",
    name: "Executive Office Chair",
    slug: "office-chair",
    category: "Office",
    description: "Premium ergonomic executive office chair with adjustable height, tilt, and lumbar support. Ideal for long work hours with its comfortable padding and breathable mesh back.",
    longDescription: "This premium executive office chair combines ergonomic design with luxurious comfort. Featuring a high-back design with integrated headrest and lumbar support, it's perfect for executives and professionals who spend long hours at their desk. The chair includes adjustable armrests, seat height adjustment, and a synchronized tilt mechanism that reclines smoothly while maintaining proper posture support. Upholstered in premium bonded leather with a breathable mesh back panel for temperature regulation. The sturdy base includes silent-roll casters that protect your floor while providing smooth mobility.",
    features: [
      "Ergonomic design with lumbar support",
      "Adjustable height and tilt mechanism",
      "Premium bonded leather upholstery",
      "Breathable mesh back panel",
      "Silent-roll casters",
      "360-degree swivel",
      "Maximum weight capacity: 120kg"
    ],
    specifications: {
      "Dimensions": "68cm W x 70cm D x 115-125cm H",
      "Seat Height": "45-55cm (adjustable)",
      "Weight": "15kg",
      "Color": "Black",
      "Material": "Bonded leather, mesh, steel frame",
      "Assembly": "Required, tools included"
    },
    price: 1800,
    discount: null,
    inStock: true,
    isTrending: true,
    isNewArrival: false,
    ratings: 4.5,
    reviewCount: 28,
    image: imageUrls.officeChairImage
  },
  "l-shaped-sofa": {
    id: 2,
    sku: "LVR-SOF02",
    name: "L-Shaped Sofa",
    slug: "l-shaped-sofa",
    category: "Living Room",
    description: "Spacious and elegant L-shaped sofa perfect for modern living rooms. Features a chaise lounge for extra comfort, with soft fabric upholstery in contemporary gray.",
    longDescription: "Transform your living room with this elegant and spacious L-shaped sectional sofa. The modern design features clean lines and a versatile layout that can be configured to suit your space. The sofa includes a chaise lounge on one end, providing the perfect spot to relax and unwind. Upholstered in premium stain-resistant fabric in a contemporary gray tone that complements most interior color schemes. High-density foam cushions provide the perfect balance of comfort and support, while the solid wood frame ensures durability for years of use. The sofa sits on sleek, tapered legs that add a touch of mid-century modern style to your space.",
    features: [
      "Configurable L-shape design with chaise lounge",
      "Premium stain-resistant fabric upholstery",
      "High-density foam cushions for optimal comfort",
      "Solid wood frame construction",
      "Removable and washable cushion covers",
      "Tapered wooden legs with protective floor pads",
      "Includes decorative throw pillows"
    ],
    specifications: {
      "Dimensions": "270cm W x 210cm D x 85cm H",
      "Seat Height": "45cm",
      "Weight": "75kg",
      "Color": "Charcoal Gray",
      "Material": "Fabric, solid wood frame, high-density foam",
      "Assembly": "Required, legs only"
    },
    price: 2500,
    discount: 10,
    inStock: true,
    isTrending: true,
    isNewArrival: true,
    ratings: 4.8,
    reviewCount: 45,
    image: imageUrls.lShapedSofaImage
  },
  "double-bed": {
    id: 3,
    sku: "BED-DB01",
    name: "Double Bed",
    slug: "double-bed",
    category: "Bedroom",
    description: "Luxurious double bed with a premium memory foam mattress and elegant wooden frame. Designed for optimal sleep comfort with a stylish headboard.",
    longDescription: "Experience the perfect night's sleep with our luxurious double bed, featuring a premium memory foam mattress and an elegant solid wood frame. The thoughtfully designed headboard adds a sophisticated touch while providing comfortable support for reading or watching TV in bed. The bed frame is constructed from kiln-dried hardwood for exceptional durability and stability, with reinforced corner blocks and center support legs to prevent sagging. The included memory foam mattress contours to your body for personalized comfort and pressure relief, while the breathable cover helps regulate temperature for a cool, comfortable sleep experience.",
    features: [
      "Solid hardwood frame in a natural finish",
      "Elegant upholstered headboard",
      "Premium memory foam mattress included",
      "Strong slat support system (no box spring needed)",
      "Reinforced center legs for added stability",
      "Under-bed storage space",
      "Non-slip mattress surface"
    ],
    specifications: {
      "Dimensions": "140cm W x 190cm L x 110cm H",
      "Mattress Size": "135cm x 190cm",
      "Weight": "65kg (frame only)",
      "Color": "Walnut",
      "Material": "Solid hardwood, fabric headboard",
      "Assembly": "Required, tools included"
    },
    price: 3000,
    discount: null,
    inStock: true,
    isTrending: false,
    isNewArrival: true,
    ratings: 4.6,
    reviewCount: 32,
    image: imageUrls.doubleBedImage
  }
};

export default function ProductDetailPage() {
  // Get product slug from URL 
  const [match, params] = useRoute("/product/:slug");
  const { toast } = useToast();
  const slug = params?.slug || "office-chair"; // Default product if none specified
  
  // Get product from mock data
  const product = products[slug as keyof typeof products] || products["office-chair"];
  
  // State for selected duration
  const [rentalDuration, setRentalDuration] = useState("3");
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Calculate pricing
  const actualPrice = product.price;
  const discountedPrice = product.discount ? actualPrice * (1 - product.discount / 100) : actualPrice;
  const totalPrice = discountedPrice * parseInt(rentalDuration);
  
  // Add to cart handler
  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart for ${rentalDuration} months.`,
    });
  };
  
  // Toggle wishlist handler
  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? `${product.name} removed from your wishlist.` : `${product.name} added to your wishlist.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <Link href="/products" className="text-gray-500 hover:text-primary flex items-center text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-white aspect-square">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">{product.category}</Badge>
                {product.isNewArrival && (
                  <Badge variant="secondary">New Arrival</Badge>
                )}
                {product.isTrending && (
                  <Badge>Trending</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              
              <div className="flex items-center mt-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(product.ratings) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : i < product.ratings 
                            ? "text-yellow-400 fill-yellow-400 opacity-50" 
                            : "text-gray-300"
                      }`} 
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    {product.ratings} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              <div className="flex items-baseline space-x-2 mb-6">
                {product.discount ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900">
                      ৳ {discountedPrice}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ৳ {actualPrice}
                    </span>
                    <Badge variant="destructive" className="ml-2">
                      {product.discount}% OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    ৳ {actualPrice}
                  </span>
                )}
                <span className="text-gray-500">/ month</span>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Rental Duration
                    </label>
                    <Select value={rentalDuration} onValueChange={setRentalDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Month</SelectItem>
                        <SelectItem value="2">2 Months</SelectItem>
                        <SelectItem value="3">3 Months</SelectItem>
                        <SelectItem value="6">6 Months</SelectItem>
                        <SelectItem value="12">12 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Availability
                    </label>
                    <div className={`flex items-center space-x-2 p-2 border rounded-md ${
                      product.inStock ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }`}>
                      {product.inStock ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span className="text-green-700">In Stock</span>
                        </>
                      ) : (
                        <>
                          <X className="h-5 w-5 text-red-500" />
                          <span className="text-red-700">Out of Stock</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-500">
                          Total for {rentalDuration} {parseInt(rentalDuration) === 1 ? "month" : "months"}
                        </span>
                        <div className="text-2xl font-bold">
                          ৳ {totalPrice}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className={isWishlisted ? "text-red-500 border-red-200 hover:text-red-700 hover:bg-red-50" : ""}
                          onClick={handleToggleWishlist}
                        >
                          <Heart className={isWishlisted ? "h-5 w-5 fill-red-500" : "h-5 w-5"} />
                        </Button>
                        
                        <Button
                          className="space-x-2"
                          onClick={handleAddToCart}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-5 w-5" />
                          <span>Add to Cart</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <TruckIcon className="h-5 w-5 text-gray-400" />
                    <span>Free Delivery & Assembly</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <RotateCcw className="h-5 w-5 text-gray-400" />
                    <span>Easy Returns & Swaps</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Package className="h-5 w-5 text-gray-400" />
                    <span>SKU: {product.sku}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="pt-4">
                <p className="text-gray-700 whitespace-pre-line">
                  {product.longDescription}
                </p>
              </TabsContent>
              
              <TabsContent value="features" className="pt-4">
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="specifications" className="pt-4">
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100">
                      <div className="font-medium text-gray-600">{key}</div>
                      <div className="col-span-2 text-gray-700">{value}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <Accordion type="single" collapsible>
              <AccordionItem value="rental-terms">
                <AccordionTrigger>Rental Terms & Conditions</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Minimum Rental Period:</strong> 1 month</p>
                    <p><strong>Security Deposit:</strong> Equivalent to one month's rent (refundable)</p>
                    <p><strong>Payment:</strong> Monthly in advance</p>
                    <p><strong>Delivery & Assembly:</strong> Free within city limits</p>
                    <p><strong>Maintenance:</strong> Regular maintenance included</p>
                    <p><strong>Damage Policy:</strong> Normal wear and tear covered; excessive damage will incur charges</p>
                    <p><strong>Early Termination:</strong> 15 days notice required; cancellation fee may apply</p>
                    <Link href="/rental-agreement" className="text-primary hover:underline block mt-2">
                      View Full Rental Agreement
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="delivery">
                <AccordionTrigger>Delivery Information</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Delivery Time:</strong> 2-3 business days</p>
                    <p><strong>Assembly Service:</strong> Included at no extra cost</p>
                    <p><strong>Delivery Area:</strong> Dhaka city and surrounding areas</p>
                    <p><strong>Special Requirements:</strong> Please inform about elevator availability or stairs</p>
                    <p><strong>Scheduling:</strong> Our team will contact you to arrange a convenient delivery time</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}