import Navbar from "@/components/ui/navbar";
import { Link, useRoute } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  // Get the slug from the URL
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug;

  // Define sample products for all categories
  const allProducts = {
    'living-room': [
      { id: 1, name: "Modern Sofa", category: "Living Room", price: 45, duration: "per month", sku: "LV-S001" },
      { id: 2, name: "Coffee Table", category: "Living Room", price: 25, duration: "per month", sku: "LV-T001" },
      { id: 3, name: "Corner Sofa", category: "Living Room", price: 55, duration: "per month", sku: "LV-CS001" },
      { id: 4, name: "TV Stand", category: "Living Room", price: 20, duration: "per month", sku: "LV-TVS001" },
      { id: 5, name: "Accent Chair", category: "Living Room", price: 18, duration: "per month", sku: "LV-AC001" },
      { id: 6, name: "Floor Lamp", category: "Living Room", price: 12, duration: "per month", sku: "LV-FL001" },
    ],
    'bedroom': [
      { id: 7, name: "Queen Bed Frame", category: "Bedroom", price: 42, duration: "per month", sku: "BD-B001" },
      { id: 8, name: "Nightstand", category: "Bedroom", price: 18, duration: "per month", sku: "BD-N001" },
      { id: 9, name: "Wardrobe", category: "Bedroom", price: 35, duration: "per month", sku: "BD-W001" },
      { id: 10, name: "Dresser", category: "Bedroom", price: 28, duration: "per month", sku: "BD-D001" },
      { id: 11, name: "Vanity Table", category: "Bedroom", price: 20, duration: "per month", sku: "BD-VT001" },
    ],
    'dining': [
      { id: 12, name: "Dining Table", category: "Dining", price: 38, duration: "per month", sku: "DN-T001" },
      { id: 13, name: "Dining Chair (set of 4)", category: "Dining", price: 32, duration: "per month", sku: "DN-C001" },
      { id: 14, name: "Sideboard", category: "Dining", price: 30, duration: "per month", sku: "DN-S001" },
      { id: 15, name: "Bar Stool", category: "Dining", price: 15, duration: "per month", sku: "DN-BS001" },
    ],
    'office': [
      { id: 16, name: "Office Desk", category: "Office", price: 40, duration: "per month", sku: "OF-D001" },
      { id: 17, name: "Ergonomic Chair", category: "Office", price: 35, duration: "per month", sku: "OF-C001" },
      { id: 18, name: "Filing Cabinet", category: "Office", price: 22, duration: "per month", sku: "OF-FC001" },
      { id: 19, name: "Bookshelf", category: "Office", price: 28, duration: "per month", sku: "OF-BS001" },
      { id: 20, name: "Desk Lamp", category: "Office", price: 12, duration: "per month", sku: "OF-DL001" },
    ],
    'study': [
      { id: 21, name: "Study Desk", category: "Study", price: 35, duration: "per month", sku: "ST-D001" },
      { id: 22, name: "Reading Chair", category: "Study", price: 28, duration: "per month", sku: "ST-RC001" },
      { id: 23, name: "Bookcase", category: "Study", price: 32, duration: "per month", sku: "ST-BC001" },
      { id: 24, name: "Reading Lamp", category: "Study", price: 15, duration: "per month", sku: "ST-RL001" },
      { id: 25, name: "Study Organizer", category: "Study", price: 18, duration: "per month", sku: "ST-O001" },
    ],
    'kids': [
      { id: 26, name: "Kid's Bed", category: "Kids", price: 30, duration: "per month", sku: "KD-B001" },
      { id: 27, name: "Study Desk for Kids", category: "Kids", price: 25, duration: "per month", sku: "KD-SD001" },
      { id: 28, name: "Toy Storage", category: "Kids", price: 20, duration: "per month", sku: "KD-TS001" },
      { id: 29, name: "Kid's Chair", category: "Kids", price: 15, duration: "per month", sku: "KD-C001" },
      { id: 30, name: "Play Table", category: "Kids", price: 22, duration: "per month", sku: "KD-PT001" },
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
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-medium">{product.name}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{product.category}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold">৳{product.price} <span className="text-sm font-normal text-gray-500">{product.duration}</span></p>
                      <Link href={`/product/${product.id}`}>
                        <Button size="sm" className="flex items-center gap-1">
                          View Details
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
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