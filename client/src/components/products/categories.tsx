import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCategories } from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

const predefinedCategories = [
  { id: 1, name: "Living Room", slug: "living-room", imageUrl: "/src/assets/Sofa Set 5.jpeg" },
  { id: 2, name: "Bedroom", slug: "bedroom", imageUrl: "/src/assets/Bed 4.jpeg" },
  { id: 3, name: "Dining", slug: "dining", imageUrl: "/src/assets/Dining Table.jpeg" },
  { id: 4, name: "Office", slug: "office", imageUrl: "/src/assets/Office Room Setup.jpeg" },
  { id: 5, name: "Kitchen", slug: "kitchen", imageUrl: "/src/assets/kitchen.jpeg" }
];

export default function ProductCategories() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: fetchCategories
  });

  const mergedCategories = predefinedCategories.map(predefined => {
    const apiCategory = categories?.find(category => category.name === predefined.name);
    return apiCategory || predefined;
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded" />
          ))
        ) : (
          mergedCategories.map((category) => (
            <Link
              key={'_id' in category ? category._id : category.id}
              href={`/category/${category.slug}`}
              className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-md overflow-hidden">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}