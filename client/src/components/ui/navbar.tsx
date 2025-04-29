import { Link, useLocation } from "wouter";
import { 
  ShoppingCart, 
  Heart, 
  Menu, 
  X, 
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function Navbar() {
  // Simplified version without auth
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img 
                src="https://img.icons8.com/fluency/48/000000/sofa.png" 
                alt="QuickRent Logo" 
                className="h-8 w-8 mr-2" 
              />
              <span className="text-xl font-semibold text-gray-800">QuickRent Furnish</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-6">
              <Link href="/" className={`${isActive('/') ? 'border-b-2 border-primary text-gray-900' : 'border-transparent border-b-2 hover:border-gray-300 text-gray-500 hover:text-gray-800'} px-1 pt-1 font-medium`}>
                Home
              </Link>
              <Link href="/products" className={`${isActive('/products') ? 'border-b-2 border-primary text-gray-900' : 'border-transparent border-b-2 hover:border-gray-300 text-gray-500 hover:text-gray-800'} px-1 pt-1 font-medium`}>
                Products
              </Link>
              <Link href="/categories" className={`${isActive('/categories') ? 'border-b-2 border-primary text-gray-900' : 'border-transparent border-b-2 hover:border-gray-300 text-gray-500 hover:text-gray-800'} px-1 pt-1 font-medium`}>
                Categories
              </Link>
              <Link href="/how-it-works" className={`${isActive('/how-it-works') ? 'border-b-2 border-primary text-gray-900' : 'border-transparent border-b-2 hover:border-gray-300 text-gray-500 hover:text-gray-800'} px-1 pt-1 font-medium`}>
                How It Works
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center">
            <div className="flex-shrink-0 ml-4 space-x-2">
              <Link href="/auth">
                <Button size="sm" variant="outline">Sign In</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
          
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className={`${isActive('/') ? 'bg-primary-50 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'} block px-3 py-2 rounded-md font-medium`}>
              Home
            </Link>
            <Link href="/products" className={`${isActive('/products') ? 'bg-primary-50 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'} block px-3 py-2 rounded-md font-medium`}>
              Products
            </Link>
            <Link href="/categories" className={`${isActive('/categories') ? 'bg-primary-50 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'} block px-3 py-2 rounded-md font-medium`}>
              Categories
            </Link>
            <Link href="/how-it-works" className={`${isActive('/how-it-works') ? 'bg-primary-50 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'} block px-3 py-2 rounded-md font-medium`}>
              How It Works
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4 space-x-4">
              <Link href="/auth">
                <Button size="sm" variant="outline">Sign In</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}