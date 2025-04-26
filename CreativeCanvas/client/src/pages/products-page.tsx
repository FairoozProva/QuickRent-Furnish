import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import ProductCard from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { fetchProducts, fetchCategories } from "@/lib/api";
import { Filter, X } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  material: string;
  categoryId: string;
  isTrending?: boolean;
  isNewArrival?: boolean;
};

type Category = {
  _id: string;
  name: string;
  slug: string;
};

export default function ProductsPage() {
  const [location] = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  
  // Parse query params
  const params = new URLSearchParams(location.split('?')[1] || '');
  const initialCategoryId = params.get('categoryId') || '';
  const initialIsTrending = params.get('trending') === 'true';
  const initialIsNewArrival = params.get('new') === 'true';
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [showTrending, setShowTrending] = useState(initialIsTrending);
  const [showNewArrivals, setShowNewArrivals] = useState(initialIsNewArrival);
  const [sortBy, setSortBy] = useState("featured");
  
  // Get all products
  const { data: products, isLoading: isLoadingProducts, error: productsError } = useQuery<Product[]>({
    queryKey: ['/api/products', selectedCategory, showTrending, showNewArrivals],
    queryFn: () => fetchProducts({
      categoryId: selectedCategory || undefined,
      isTrending: showTrending || undefined,
      isNewArrival: showNewArrivals || undefined
    }),
  });
  
  // Get all categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: fetchCategories,
  });
  
  // Sort and filter products
  const filteredProducts = products
    ? products
        .filter(product => product.price >= priceRange[0] && product.price <= priceRange[1])
        .sort((a, b) => {
          if (sortBy === "price-low-high") return a.price - b.price;
          if (sortBy === "price-high-low") return b.price - a.price;
          return 0; // featured or default
        })
    : [];
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 20000]);
    setShowTrending(false);
    setShowNewArrivals(false);
    setSortBy("featured");
  };
  
  // Page title based on filters
  const getPageTitle = () => {
    if (showTrending) return "Trending Products";
    if (showNewArrivals) return "New Arrivals";
    if (selectedCategory && categories) {
      const category = categories.find(cat => cat._id === selectedCategory);
      if (category) return `${category.name} Products`;
    }
    return "All Products";
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={toggleFilters}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            
            <div className="w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters - Desktop */}
          <div className={`col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
                {isLoadingCategories ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox
                        id="all-categories"
                        checked={selectedCategory === ''}
                        onCheckedChange={() => setSelectedCategory('')}
                      />
                      <Label 
                        htmlFor="all-categories" 
                        className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        All Categories
                      </Label>
                    </div>
                    {categories?.map(category => (
                      <div key={category._id} className="flex items-center">
                        <Checkbox
                          id={category._id}
                          checked={selectedCategory === category._id}
                          onCheckedChange={() => setSelectedCategory(category._id)}
                        />
                        <Label 
                          htmlFor={category._id} 
                          className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 20000]}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={20000}
                    step={1000}
                    className="mt-6"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>₹{priceRange[0]}/mo</span>
                    <span>₹{priceRange[1]}/mo</span>
                  </div>
                </div>
              </div>
              
              {/* Other Filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Product Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="trending"
                      checked={showTrending}
                      onCheckedChange={() => setShowTrending(!showTrending)}
                    />
                    <Label 
                      htmlFor="trending" 
                      className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      Trending
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id="new-arrivals"
                      checked={showNewArrivals}
                      onCheckedChange={() => setShowNewArrivals(!showNewArrivals)}
                    />
                    <Label 
                      htmlFor="new-arrivals" 
                      className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      New Arrivals
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Products */}
          <div className="col-span-1 lg:col-span-3">
            {productsError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                <p>Failed to load products. Please try again later.</p>
              </div>
            ) : isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <Skeleton className="w-full h-56" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-1/2 mb-3" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium text-gray-900 mb-2">No products found</h2>
                <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
                <Button 
                  variant="outline" 
                  onClick={clearFilters} 
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    showNewBadge={product.isNewArrival}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
