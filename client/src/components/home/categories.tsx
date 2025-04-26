import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCategories, fetchAbout } from "@/lib/api";

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
  { title: "Sofa Sets", description: "Comfortable and stylish living room furniture", imageUrl: "/src/assets/Sofa Set 1.jpeg", category: "sofa-set" },
  { title: "Bedroom", description: "Cozy and elegant bedroom furniture", imageUrl: "/src/assets/Bed 1.jpeg", category: "bedroom" },
  { title: "Dining", description: "Beautiful dining room collections", imageUrl: "/src/assets/Dining Table.jpeg", category: "dining" },
  { title: "Study", description: "Functional study and office furniture", imageUrl: "/src/assets/Study Table 1.jpeg", category: "study" },
  { title: "Kitchen", description: "Essential kitchen furniture and storage", imageUrl: "/src/assets/kitchen.jpeg", category: "kitchen" },
  { title: "Office", description: "Professional office furniture solutions", imageUrl: "/src/assets/Office Room Setup.jpeg", category: "office" }
];
const predefinedCategories: PredefinedCategory[] = [
  { id: 1, name: "Living Room", slug: "living-room", imageUrl: "/src/assets/Sofa Set 5.jpeg" },
  { id: 2, name: "Bedroom", slug: "bedroom", imageUrl: "/src/assets/Bed 4.jpeg" },
  { id: 3, name: "Dining", slug: "dining", imageUrl: "/src/assets/Dining Table.jpeg" },
  { id: 4, name: "Office", slug: "office", imageUrl: "/src/assets/Office Room Setup.jpeg" },
  { id: 5, name: "Kitchen", slug: "kitchen", imageUrl: "/src/assets/kitchen.jpeg" },
  { id: 6, name: "Study", slug: "study", imageUrl: "/src/assets/Study Table 3.jpeg" }
];

interface AboutSection {
  title: string;
  description: string;
  imageUrl: string;
}

const aboutSections: AboutSection[] = [
  { title: "Our Mission", imageUrl: "/src/assets/Sofa Set 5.jpeg", description: "We provide high-quality furniture rentals" },
  { title: "Quality First", imageUrl: "/src/assets/Bed 4.jpeg", description: "Premium furniture for every home" },
  { title: "Easy Process", imageUrl: "/src/assets/Dining Table.jpeg", description: "Simple rental process for your convenience" },
  { title: "Customer Care", imageUrl: "/src/assets/Office Room Setup.jpeg", description: "24/7 support for all your needs" },
  { title: "Affordable", imageUrl: "/src/assets/kitchen.jpeg", description: "Budget-friendly rental options" },
  { title: "Fast Delivery", imageUrl: "/src/assets/Study Table 3.jpeg", description: "Quick and reliable delivery service" }
];

type MergedCategory = PredefinedCategory | Category;

export function Categories() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Shop By Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {predefinedCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
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
      </div>
    </section>
  );
}
