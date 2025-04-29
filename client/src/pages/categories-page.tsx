import Navbar from "@/components/ui/navbar";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { imageUrls } from "../lib/image-urls";

export default function CategoriesPage() {
  // Define some sample categories with images
  const categories = [
    { 
      id: 1, 
      name: "Living Room", 
      slug: "living-room", 
      description: "Comfortable sofas, coffee tables, and more for your living room", 
      imageUrl: imageUrls.sofaImage4 
    },
    { 
      id: 2, 
      name: "Bedroom", 
      slug: "bedroom", 
      description: "Beds, nightstands, and other bedroom essentials", 
      imageUrl: imageUrls.bohoBedImage 
    },
    { 
      id: 3, 
      name: "Dining", 
      slug: "dining", 
      description: "Dining tables, chairs, and dining room accessories", 
      imageUrl: imageUrls.bohoDiningTableImage 
    },
    { 
      id: 4, 
      name: "Office", 
      slug: "office", 
      description: "Desks, office chairs, and work-from-home solutions", 
      imageUrl: imageUrls.officeSetupImage 
    },
    { 
      id: 5, 
      name: "Study", 
      slug: "study", 
      description: "Bookshelves, reading desks, and study room accessories", 
      imageUrl: imageUrls.studyTable1Image 
    },
    { 
      id: 6, 
      name: "Kids", 
      slug: "kids", 
      description: "Furniture for children's rooms and play areas", 
      imageUrl: imageUrls.bed1Image 
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Categories</h1>
          <p className="text-lg text-gray-700">
            Browse our complete range of furniture categories to find what you're looking for
          </p>
        </div>
      </div>
      
      {/* Categories Grid */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link href={`/category/${category.slug}`} key={category.id}>
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                  <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                    <img src={category.imageUrl} alt={category.name} className="object-cover w-full h-full" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{category.description}</p>
                  <div className="flex items-center justify-end">
                    <div className="flex items-center text-primary">
                      <span className="mr-2">View Products</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
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