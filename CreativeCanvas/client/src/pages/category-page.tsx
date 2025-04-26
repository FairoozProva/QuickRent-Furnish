import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import ProductCard from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCategoryBySlug, fetchProducts } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  material: string;
  categoryId: string;
};

type Category = {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  
  // Fetch category details
  const { 
    data: category, 
    isLoading: isLoadingCategory, 
    error: categoryError 
  } = useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
    queryFn: () => fetchCategoryBySlug(slug),
  });
  
  // Fetch products in this category
  const { 
    data: products, 
    isLoading: isLoadingProducts, 
    error: productsError 
  } = useQuery<Product[]>({
    queryKey: [`/api/products`, category?._id],
    queryFn: () => fetchProducts({ categoryId: category?._id }),
    enabled: !!category?._id,
  });
  
  if (categoryError) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load category information. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoadingCategory ? (
          <div className="space-y-4 mb-8">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        ) : (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{category?.name}</h1>
            <p className="mt-2 text-lg text-gray-600">
              Browse our collection of premium {category?.name.toLowerCase()} furniture for rent
            </p>
          </div>
        )}
        
        {productsError ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load products. Please try again later.
            </AlertDescription>
          </Alert>
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
        ) : products?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-medium text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-500">There are currently no products available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
