import Navbar from "@/components/ui/navbar";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { imageUrls } from "../lib/image-urls";

export default function ProductsPage() {
  // Define some sample products with image URLs
  const products = [
    { id: 1, name: "Modern Sofa", category: "Living Room", price: 45, duration: "per month", sku: "LV-S001", imageUrl: imageUrls.sofaImage5 },
    { id: 2, name: "Round Dining Table", category: "Dining", price: 38, duration: "per month", sku: "DN-T001", imageUrl: imageUrls.roundDiningTableImage },
    { id: 3, name: "Queen Bed Frame", category: "Bedroom", price: 42, duration: "per month", sku: "BD-B001", imageUrl: imageUrls.bed4Image },
    { id: 4, name: "Study Table", category: "Study", price: 35, duration: "per month", sku: "ST-T001", imageUrl: imageUrls.studyTable3Image },
    { id: 5, name: "Dining Table", category: "Dining", price: 38, duration: "per month", sku: "DN-T002", imageUrl: imageUrls.diningTableImage },
    { id: 6, name: "Office Chair", category: "Office", price: 32, duration: "per month", sku: "OF-C001", imageUrl: imageUrls.officeChairImage },
    { id: 7, name: "Executive Desk", category: "Office", price: 40, duration: "per month", sku: "OF-D001", imageUrl: imageUrls.executiveDeskImage },
    { id: 8, name: "Kids Bed", category: "Kids", price: 35, duration: "per month", sku: "KD-B001", imageUrl: imageUrls.bed1Image },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-lg text-gray-700">
            Browse our complete range of furniture products available for rent
          </p>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Heart size={20} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xl font-bold">৳{product.price} <span className="text-sm font-normal text-gray-500">{product.duration}</span></p>
                    <Link href={`/product/${product.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
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