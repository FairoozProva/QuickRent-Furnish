import { Button } from "@/components/ui/button";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Navbar from "@/components/ui/navbar";
import { imageUrls } from "../lib/image-urls";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "@/lib/api";

export default function CategoryPage() {
  const [match, params] = useRoute("/category/:slug");
  const slug = params?.slug;
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => addToCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: 'Added to cart',
        description: 'Item has been added to your cart.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to add to cart',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleAddToCart = (productId: string, productName: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add items to your cart.',
        variant: 'destructive',
      });
      return;
    }
    
    addToCartMutation.mutate(productId);
  };

  // Define sample products for all categories using image URLs
  const allProducts = {
    'living-room': [
      { id: 1, name: "Modern Sofa", category: "Living Room", price: 2500, duration: "per month", sku: "LV-S001", imageUrl: imageUrls.sofaImage1 },
      { id: 2, name: "L-Shaped Sofa", category: "Living Room", price: 2000, duration: "per month", sku: "LV-S002", imageUrl: imageUrls.sofaImage6 },
      { id: 3, name: "Corner Sofa", category: "Living Room", price: 1800, duration: "per month", sku: "LV-CS001", imageUrl: imageUrls.sofaImage4 },
      { id: 4, name: "Sectional Sofa", category: "Living Room", price: 1500, duration: "per month", sku: "LV-S003", imageUrl: imageUrls.sofaImage3 },
      { id: 5, name: "Comfortable Sofa", category: "Living Room", price: 1400, duration: "per month", sku: "LV-S004", imageUrl: imageUrls.sofaImage5 },
      { id: 6, name: "Double Sofa", category: "Living Room", price: 1000, duration: "per month", sku: "LV-S005", imageUrl: imageUrls.sofaImage2 },
    ],
    'bedroom': [
      { id: 7, name: "Wooden Bed", category: "Bedroom", price: 1300, duration: "per month", sku: "BD-B001", imageUrl: imageUrls.bed1Image },
      { id: 8, name: "Double Bed", category: "Bedroom", price: 2000, duration: "per month", sku: "BD-B002", imageUrl: imageUrls.bed2Image },
      { id: 9, name: "Single Bed", category: "Bedroom", price: 1000, duration: "per month", sku: "BD-B003", imageUrl: imageUrls.bed3Image },
      { id: 10, name: "Queen Bed Frame", category: "Bedroom", price: 2500, duration: "per month", sku: "BD-B004", imageUrl: imageUrls.bed4Image },
      { id: 11, name: "Boho Bed", category: "Bedroom", price: 1500, duration: "per month", sku: "BD-B005", imageUrl: imageUrls.bohoBedImage },
    ],
    'dining': [
      { id: 12, name: "Dining Table", category: "Dining", price: 1500, duration: "per month", sku: "DN-T001", imageUrl: imageUrls.diningTableImage },
      { id: 13, name: "Round Dining Table", category: "Dining", price: 2500, duration: "per month", sku: "DN-T002", imageUrl: imageUrls.roundDiningTableImage },
      { id: 14, name: "Boho Dining Table", category: "Dining", price: 2000, duration: "per month", sku: "DN-T003", imageUrl: imageUrls.bohoDiningTableImage },
      { id: 15, name: "Dark Wood & White Chair Dining Table", category: "Dining", price: 3000, duration: "per month", sku: "DN-T004", imageUrl: imageUrls.darkDiningTableImage },
    ],
    'office': [
      { id: 16, name: "Executive Office Setup", category: "Office", price: 5000, duration: "per month", sku: "OF-S001", imageUrl: imageUrls.officeSetupImage },
      { id: 17, name: "Modern Office Chair", category: "Office", price: 500, duration: "per month", sku: "OF-C001", imageUrl: imageUrls.officeChairImage },
      { id: 18, name: "White Office Chair", category: "Office", price: 1000, duration: "per month", sku: "OF-C002", imageUrl: imageUrls.neutralOfficeChairImage },
      { id: 19, name: "Black Office Chair", category: "Office", price: 1000, duration: "per month", sku: "OF-C003", imageUrl: imageUrls.laptopChairImage },
      { id: 20, name: "Office Desk", category: "Office", price: 3000, duration: "per month", sku: "OF-D001", imageUrl: imageUrls.executiveDeskImage },
    ],
    'study': [
      { id: 21, name: "Study Table 1", category: "Study", price: 800, duration: "per month", sku: "ST-T001", imageUrl: imageUrls.studyTable1Image },
      { id: 22, name: "Study Table 2", category: "Study", price: 500, duration: "per month", sku: "ST-T002", imageUrl: imageUrls.studyTable2Image },
      { id: 23, name: "Study Table 3", category: "Study", price: 700, duration: "per month", sku: "ST-T003", imageUrl: imageUrls.studyTable3Image },
      { id: 24, name: "Study Table 4", category: "Study", price: 800, duration: "per month", sku: "ST-T004", imageUrl: imageUrls.studyTable4Image },
      { id: 25, name: "Study Table 5", category: "Study", price: 1200, duration: "per month", sku: "ST-T005", imageUrl: imageUrls.studyTable5Image },
    ],
    'kids': [
      { id: 26, name: "Kid's Bed", category: "Kids", price: 1000, duration: "per month", sku: "KD-B001", imageUrl: imageUrls.kidsBed1Image },
      { id: 27, name: "Study Desk for Kids", category: "Kids", price: 800, duration: "per month", sku: "KD-SD001", imageUrl: imageUrls.kidsTable1Image },
      { id: 28, name: "Kid's Bed with Cloud", category: "Kids", price: 900, duration: "per month", sku: "KD-B002", imageUrl: imageUrls.kidsBed2Image },
      { id: 29, name: "Kid's Study Butterfly Table", category: "Kids", price: 500, duration: "per month", sku: "KD-SD002", imageUrl: imageUrls.kidsTable2Image },
      { id: 30, name: "Kid's Giraffe Shelf", category: "Kids", price: 400, duration: "per month", sku: "KD-SH001", imageUrl: imageUrls.kidsShelfImage },
    ],
  };
  
  // Get products for current category
  const products = slug ? (allProducts[slug as keyof typeof allProducts] || []) : [];

  // Get category name based on slug
  const getCategoryName = () => {
    switch(slug) {
      case 'living-room': return 'Living Room';
      case 'bedroom': return 'Bedroom';
      case 'dining': return 'Dining';
      case 'office': return 'Office';
      case 'study': return 'Study';
      case 'kids': return 'Kids';
      default: return slug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Category';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Link href="/categories">
              <Button variant="ghost" className="flex items-center gap-1 mr-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Categories
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{getCategoryName()}</h1>
          </div>
          <p className="text-lg text-gray-700">
            Browse our collection of premium {getCategoryName().toLowerCase()} furniture for rent
          </p>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm">
              <h2 className="text-xl font-medium text-gray-900 mb-2">No products found</h2>
              <p className="text-gray-500">There are currently no products available in this category.</p>
              <Link href="/products">
                <Button className="mt-4">Browse All Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{product.category}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold">৳{product.price} <span className="text-sm font-normal text-gray-500">{product.duration}</span></p>
                      <Button 
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleAddToCart(product.id.toString(), product.name)}
                        disabled={addToCartMutation.isPending}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-xl font-bold mb-4">QuickRent Furnish</h2>
              <p className="text-gray-400 max-w-xs">
                Premium furniture rental solutions for homes and offices
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                  <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
                  <li><Link href="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
                  <li><Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center md:text-left">
            <p className="text-gray-400">© 2023 QuickRent Furnish. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}