import Navbar from "@/components/ui/navbar";
import { Link } from "wouter";
import { ArrowRight, Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { imageUrls } from "../lib/image-urls";

export default function HomePage() {
  // Define categories with URLs for the home page
  const categories = [
    {
      id: 1,
      name: "Living Room",
      slug: "living-room",
      description: "Comfortable sofas, coffee tables, and more",
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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-100 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Rent Premium Furniture for Your Space
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Transform your home with high-quality furniture rentals. No commitment, just comfort.
              </p>
              <div className="flex gap-4">
                <Link href="/products">
                  <Button size="lg">Browse Products</Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" size="lg">How It Works</Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6" 
                alt="Modern Furniture" 
                className="w-full max-w-md rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop By Categories</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our wide range of furniture categories to find the perfect pieces for your home or office
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link href={`/category/${category.slug}`} key={category.id}>
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                  <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                    <img src={category.imageUrl} alt={category.name} className="object-cover w-full h-full" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{category.description}</p>
                  <div className="flex items-center text-primary">
                    <span className="mr-2">View Products</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/categories">
              <Button variant="outline">View All Categories</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Trending Now Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Now</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our most popular pieces this month, handpicked for your home
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Trending Product 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-64">
                <img 
                  src={imageUrls.studyTable1Image} 
                  alt="White Study Table" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">White Study Table</h3>
                <p className="text-sm text-gray-600 mb-3">Wood</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">৳ 300<span className="text-gray-500 text-sm">/month</span></span>
                  <Link href="/product/study-table" className="text-primary text-sm flex items-center">
                    Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Trending Product 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-64">
                <img 
                  src={imageUrls.bohoDiningTableImage} 
                  alt="Boho Sofa" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">Boho Sofa</h3>
                <p className="text-sm text-gray-600 mb-3">Premium Fabric</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">৳ 1000<span className="text-gray-500 text-sm">/month</span></span>
                  <Link href="/product/l-shaped-sofa" className="text-primary text-sm flex items-center">
                    Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Trending Product 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-64">
                <img 
                  src={imageUrls.doubleBedImage} 
                  alt="Bed ER6456" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">Bed ER6456</h3>
                <p className="text-sm text-gray-600 mb-3">Wood</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">৳ 800<span className="text-gray-500 text-sm">/month</span></span>
                  <Link href="/product/double-bed" className="text-primary text-sm flex items-center">
                    Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* New Arrivals Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our latest additions, fresh designs for your living space
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* New Arrival 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
              <div className="relative h-64">
                <img 
                  src={imageUrls.singleBedImage} 
                  alt="Storage Bed" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <div className="absolute top-3 left-3 py-1 px-2 bg-primary text-white text-xs font-semibold rounded">
                  New
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">Storage Bed</h3>
                <p className="text-sm text-gray-600 mb-3">Wood</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">৳ 700<span className="text-gray-500 text-sm">/month</span></span>
                  <Link href="/product/double-bed" className="text-primary text-sm flex items-center">
                    Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* New Arrival 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
              <div className="relative h-64">
                <img 
                  src={imageUrls.officeChairImage} 
                  alt="Neutral Office Chair" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <div className="absolute top-3 left-3 py-1 px-2 bg-primary text-white text-xs font-semibold rounded">
                  New
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">Neutral Office Chair</h3>
                <p className="text-sm text-gray-600 mb-3">Fabric</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">৳ 500<span className="text-gray-500 text-sm">/month</span></span>
                  <Link href="/product/office-chair" className="text-primary text-sm flex items-center">
                    Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* New Arrival 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
              <div className="relative h-64">
                <img 
                  src={imageUrls.studyTableImage} 
                  alt="Wooden Study Table" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <div className="absolute top-3 left-3 py-1 px-2 bg-primary text-white text-xs font-semibold rounded">
                  New
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">Wooden Study Table</h3>
                <p className="text-sm text-gray-600 mb-3">Wood</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">৳ 300<span className="text-gray-500 text-sm">/month</span></span>
                  <Link href="/product/study-table" className="text-primary text-sm flex items-center">
                    Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose QuickRent Furnish</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide a hassle-free furniture rental experience with quality products and excellent service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Rental Terms</h3>
              <p className="text-gray-600">
                Choose rental durations that work for you, from short-term to long-term options
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                All our furniture is carefully selected for quality, durability, and style
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hassle-Free Delivery</h3>
              <p className="text-gray-600">
                We handle delivery, assembly, and pickup - you just enjoy your furniture
              </p>
            </div>
          </div>
        </div>
      </section>
      
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