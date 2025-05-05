import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useState } from "react";
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

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  // Get cart count
  const { data: cartItems } = useQuery({
    queryKey: ['/api/cart'],
    enabled: !!user,
    placeholderData: [],
  });
  
  // Get wishlist count
  const { data: wishlistItems } = useQuery({
    queryKey: ['/api/wishlist'],
    enabled: !!user,
    placeholderData: [],
  });

  const cartCount = cartItems?.length || 0;
  const wishlistCount = wishlistItems?.length || 0;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              {/* Temporarily removed logo image */}
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
            {user && (
              <>
                <div className="flex-shrink-0 relative">
                  <Link href="/wishlist" className="p-2 rounded-full text-gray-500 hover:text-gray-800 focus:outline-none relative">
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </div>
                <div className="flex-shrink-0 relative ml-4">
                  <Link href="/cart" className="p-2 rounded-full text-gray-500 hover:text-gray-800 focus:outline-none relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </>
            )}
            
            <div className="flex-shrink-0 ml-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/rentals">My Rentals</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth">
                  <Button size="sm">Sign In</Button>
                </Link>
              )}
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
              {user && (
                <>
                  <Link href="/wishlist" className="p-2 rounded-full text-gray-500 hover:text-gray-800 focus:outline-none relative inline-block">
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/cart" className="p-2 rounded-full text-gray-500 hover:text-gray-800 focus:outline-none relative inline-block">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="text-sm font-medium text-gray-500">
                    {user.name}
                  </Link>
                  <Button size="sm" variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/auth">
                  <Button size="sm">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
