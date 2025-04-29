import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

interface BaseCategory {
  name: string;
  slug: string;
  imageUrl: string;
  products?: string[];
}

interface PredefinedCategory extends BaseCategory {
  id: number;
}

interface Category extends BaseCategory {
  _id: string;
}

interface ProductSection {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

const productSections: ProductSection[] = [
  { title: "Sofa Sets", description: "Comfortable and stylish living room furniture", imageUrl: "", category: "sofa-set" },
  { title: "Bedroom", description: "Cozy and elegant bedroom furniture", imageUrl: "", category: "bedroom" },
  { title: "Dining", description: "Beautiful dining room collections", imageUrl: "", category: "dining" },
  { title: "Study", description: "Functional study and office furniture", imageUrl: "", category: "study" },
  { title: "Kitchen", description: "Essential kitchen furniture and storage", imageUrl: "", category: "kitchen" },
  { title: "Office", description: "Professional office furniture solutions", imageUrl: "", category: "office" }
];
const predefinedCategories: PredefinedCategory[] = [
  { id: 1, name: "Living Room", slug: "living-room", imageUrl: "" },
  { id: 2, name: "Bedroom", slug: "bedroom", imageUrl: "" },
  { id: 3, name: "Dining", slug: "dining", imageUrl: "" },
  { id: 4, name: "Office", slug: "office", imageUrl: "" },
  { id: 5, name: "Kitchen", slug: "kitchen", imageUrl: "" },
  { id: 6, name: "Study", slug: "study", imageUrl: "" }
];

interface AboutSection {
  title: string;
  description: string;
  imageUrl: string;
}

const aboutSections: AboutSection[] = [
  { title: "Our Mission", imageUrl: "", description: "We provide high-quality furniture rentals" },
  { title: "Quality First", imageUrl: "", description: "Premium furniture for every home" },
  { title: "Easy Process", imageUrl: "", description: "Simple rental process for your convenience" },
  { title: "Customer Care", imageUrl: "", description: "24/7 support for all your needs" },
  { title: "Affordable", imageUrl: "", description: "Budget-friendly rental options" },
  { title: "Fast Delivery", imageUrl: "", description: "Quick and reliable delivery service" }
];

type MergedCategory = PredefinedCategory | Category;

export function Categories() {
  // Fetch categories from API
  const { data: apiCategories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    placeholderData: [],
  });

  // Use API categories if available, otherwise use predefined categories
  const categories = apiCategories && apiCategories.length > 0
    ? apiCategories
    : predefinedCategories;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Shop By Category</h2>
        
        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-w-16 aspect-h-9">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center text-red-500">
            <p>Unable to load categories. Please try again later.</p>
          </div>
        ) : (
          // Categories grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={'_id' in category ? category._id : category.id}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-semibold text-white">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
