import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

type Category = {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
};

export default function Categories() {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  if (error) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Shop by Category</h2>
            <p className="mt-4 text-lg text-red-500">Error loading categories. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Shop by Category</h2>
          <p className="mt-4 text-lg text-gray-500">Browse our curated collection of premium furniture</p>
        </div>
        
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="group">
                <Skeleton className="w-full h-40 rounded-lg" />
                <Skeleton className="mt-4 h-4 w-20 mx-auto" />
              </div>
            ))
          ) : (
            categories?.map((category) => (
              <Link key={category._id} href={`/category/${category.slug}`}>
                <div className="group cursor-pointer">
                  <div className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden group-hover:opacity-90 transition-opacity">
                    <img 
                      src={category.imageUrl} 
                      alt={category.name} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700 font-medium text-center">{category.name}</h3>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
