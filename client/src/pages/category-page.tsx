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

  // Update mock products logic to restrict 'Boho Sofa' to the Living Room category
  const mockProducts = category?.slug === "living-room" ? [
    {
      _id: "boho-sofa",
      name: "Boho Sofa",
      description: "A stylish and comfortable sofa for your living room.",
      price: 1000,
      imageUrl: "/src/assets/Sofa Set 1.jpeg",
      material: "Fabric, Wood",
      categoryId: "living-room",
    },
    {
      _id: "sofa-set-2",
      name: "Sofa Set 2",
      description: "A comfortable and stylish sofa set.",
      price: 500,
      imageUrl: "/src/assets/Sofa Set 2.jpeg",
      material: "Fabric, Wood",
      categoryId: "living-room",
    },
    {
      _id: "sofa-set-3",
      name: "5 seated Sofa Set",
      description: "A comfortable and stylish sofa set.",
      price: 800,
      imageUrl: "/src/assets/Sofa Set 3.jpeg",
      material: "Fabric, Wood",
      categoryId: "living-room",
    },
    {
      _id: "l-sofa-set",
      name: "L Sofa Set",
      description: "A comfortable and stylish sofa set.",
      price: 1500,
      imageUrl: "/src/assets/Sofa Set 4.jpeg",
      material: "Fabric, Wood",
      categoryId: "living-room",
    },
    {
      _id: "wooden-sofa-set",
      name: "Wooden Sofa Set",
      description: "A comfortable and stylish sofa set.",
      price: 1000,
      imageUrl: "/src/assets/Sofa Set 5.jpeg",
      material: "Fabric, Wood",
      categoryId: "living-room",
    },
    {
      _id: "six-seated-sofa-set",
      name: "6 seated Sofa Set",
      description: "A comfortable and stylish sofa set.",
      price: 2000,
      imageUrl: "/src/assets/Sofa Set 6.jpeg",
      material: "Fabric, Wood",
      categoryId: "living-room",
    },
    {
      _id: "white-sofa-set",
      name: "White Sofa Set",
      description: "A comfortable and stylish sofa set.",
      price: 2000,
      imageUrl: "/src/assets/Sofa Set 7.jpeg",
      material: "Fabric, Wood",
      categoryId: "living-room",
    },
  ] : category?.slug === "bedroom" ? [
    {
      _id: "queen-size-bed",
      name: "Queen Size Bed",
      description: "A spacious and comfortable queen size bed.",
      price: 1200,
      imageUrl: "/src/assets/Bed 1.jpeg",
      material: "Wood, Foam",
      categoryId: "bedroom",
    },
    {
      _id: "modern-bed-frame",
      name: "Modern Bed Frame",
      description: "A sleek and modern bed frame for your bedroom.",
      price: 1500,
      imageUrl: "/src/assets/Bed 2.jpeg",
      material: "Metal, Wood",
      categoryId: "bedroom",
    },
    {
      _id: "hargrove-bed",
      name: "Hargrove Bed",
      description: "A stylish bed with a unique design.",
      price: 1800,
      imageUrl: "/src/assets/Hargrove Bed.jpeg",
      material: "Wood, Fabric",
      categoryId: "bedroom",
    },
    {
      _id: "elina-queen-size-platform-bed",
      name: "Elina Queen Size Platform Bed",
      description: "A premium queen size platform bed for a luxurious bedroom experience.",
      price: 2500,
      imageUrl: "/src/assets/Elina Queen Size Platform Bed.jpeg",
      material: "Wood, Upholstery",
      categoryId: "bedroom",
    },
    {
      _id: "white-sofa-set-bed-2",
      name: "White Sofa Set",
      description: "A comfortable and stylish sofa set.",
      price: 2500,
      imageUrl: "/src/assets/Bed 2.jpeg",
      material: "Fabric, Wood",
      categoryId: "bedroom",
    },
    {
      _id: "white-sofa-set-bed-3",
      name: "White Sofa Set",
      description: "A comfortable and stylish sofa set.",
      price: 1500,
      imageUrl: "/src/assets/Bed 3.jpeg",
      material: "Fabric, Wood",
      categoryId: "bedroom",
    },
    {
      _id: "bed-er6456",
      name: "Bed ER6456",
      description: "A comfortable and stylish sofa set.",
      price: 800,
      imageUrl: "/src/assets/Bed 4.jpeg",
      material: "Fabric, Wood",
      categoryId: "bedroom",
    },
  ] : category?.slug === "office" ? [
    {
      _id: "executive-desk",
      name: "Large Executive Desk With File Cabinet",
      description: "A spacious executive desk with an integrated file cabinet for office use.",
      price: 3000,
      imageUrl: "/src/assets/Large Executive Desk With File Cabinet.jpeg",
      material: "Wood, Metal",
      categoryId: "office",
    },
    {
      _id: "modern-office-chair",
      name: "Modern Office Chair",
      description: "A sleek and comfortable office chair for modern workspaces.",
      price: 1200,
      imageUrl: "/src/assets/Modern Office Chair.jpeg",
      material: "Fabric, Metal",
      categoryId: "office",
    },
    {
      _id: "neutral-office-chair",
      name: "Neutral Office Chair",
      description: "A neutral-toned office chair that blends with any office decor.",
      price: 1000,
      imageUrl: "/src/assets/Neutral Office Chair.jpeg",
      material: "Fabric, Plastic",
      categoryId: "office",
    },
    {
      _id: "comfortable-office-chair",
      name: "Comfortable Office Chair",
      description: "An ergonomic office chair designed for laptop users.",
      price: 1500,
      imageUrl: "/src/assets/Comfortable Office Chairs for Laptop Users.jpeg",
      material: "Mesh, Metal",
      categoryId: "office",
    },
    {
      _id: "computer-desk-chair",
      name: "Computer Desk Chair",
      description: "A compact and comfortable chair for computer desks.",
      price: 800,
      imageUrl: "/src/assets/Computer Desk Chair.jpeg",
      material: "Fabric, Plastic",
      categoryId: "office",
    },
    {
      _id: "office-room-setup",
      name: "Office Room Setup",
      description: "A multi-drawer study table.",
      price: 5000,
      imageUrl: "/src/assets/Office Room Setup.jpeg",
      material: "Wood, Metal",
      categoryId: "office",
    },
  ] : category?.slug === "study" ? [
    {
      _id: "study-table-1",
      name: "Modern Study Table",
      description: "A sleek and modern study table for students and professionals.",
      price: 1200,
      imageUrl: "/src/assets/Study Table 1.jpeg",
      material: "Wood, Metal",
      categoryId: "study",
    },
    {
      _id: "study-table-2",
      name: "Compact Study Table",
      description: "A compact study table perfect for small spaces.",
      price: 800,
      imageUrl: "/src/assets/Study Table 2.jpeg",
      material: "Wood, Plastic",
      categoryId: "study",
    },
    {
      _id: "study-table-3",
      name: "Ergonomic Study Table",
      description: "An ergonomic study table designed for long hours of work or study.",
      price: 1500,
      imageUrl: "/src/assets/Study Table 3.jpeg",
      material: "Wood, Metal",
      categoryId: "study",
    },
    {
      _id: "study-table-4",
      name: "Adjustable Study Table",
      description: "A study table with adjustable height for added convenience.",
      price: 1800,
      imageUrl: "/src/assets/Study Table 4.jpeg",
      material: "Wood, Metal",
      categoryId: "study",
    },
    {
      _id: "study-table-5",
      name: "Classic Study Table",
      description: "A classic wooden study table with a timeless design.",
      price: 1000,
      imageUrl: "/src/assets/Study Table 5.jpeg",
      material: "Wood",
      categoryId: "study",
    },
    {
      _id: "white-study-table",
      name: "White Study Table",
      description: "A multi-drawer study table.",
      price: 300,
      imageUrl: "/src/assets/Study Table 1.jpeg",
      material: "Wood, Plastic",
      categoryId: "study",
    },
  ] : category?.slug === "kitchen" ? [
    {
      _id: "kitchen-setup-1",
      name: "Modern Kitchen Setup",
      description: "A sleek and modern kitchen setup with all essentials.",
      price: 5000,
      imageUrl: "/src/assets/kitchen Setup.jpeg",
      material: "Wood, Metal",
      categoryId: "kitchen",
    },
    {
      _id: "small-kitchen-setup",
      name: "Small Kitchen Setup",
      description: "A compact kitchen setup perfect for small spaces.",
      price: 3000,
      imageUrl: "/src/assets/Small Kitchen.jpeg",
      material: "Wood, Plastic",
      categoryId: "kitchen",
    },
    {
      _id: "kitchen-cabinet",
      name: "Kitchen Cabinet Organizer",
      description: "A versatile cabinet for kitchen organization.",
      price: 2000,
      imageUrl: "/src/assets/kitchen.jpeg",
      material: "Wood, Metal",
      categoryId: "kitchen",
    },
  ] : category?.slug === "dining" ? [
    {
      _id: "dining-table-5555",
      name: "Dining Table 5555",
      description: "A spacious dining table for family meals.",
      price: 4000,
      imageUrl: "/src/assets/Dining Table 5555.jpeg",
      material: "Wood, Glass",
      categoryId: "dining",
    },
    {
      _id: "dining-table-kiu85",
      name: "Dining Table KIU85",
      description: "A modern dining table with a sleek design.",
      price: 3500,
      imageUrl: "/src/assets/Dining Table KIU85.jpeg",
      material: "Wood, Metal",
      categoryId: "dining",
    },
    {
      _id: "round-dining-table",
      name: "Round Dining Table",
      description: "A round dining table perfect for small spaces.",
      price: 3000,
      imageUrl: "/src/assets/Round Dining Table.jpeg",
      material: "Wood",
      categoryId: "dining",
    },
    {
      _id: "modern-boho-dining-table",
      name: "Modern Boho Dining Table",
      description: "A stylish boho dining table for modern homes.",
      price: 4500,
      imageUrl: "/src/assets/Modern Boho Dining Table.jpeg",
      material: "Wood, Rattan",
      categoryId: "dining",
    },
    {
      _id: "stunning-dark-dining-wood-table",
      name: "Stunning Dark Dining Wood Table",
      description: "A stunning dark wood dining table for elegant dining rooms.",
      price: 5000,
      imageUrl: "/src/assets/Stunning Dark Dining Wood Table.jpeg",
      material: "Wood",
      categoryId: "dining",
    },
  ] : [];

  // Use mockProducts if no products are fetched
  const productsToDisplay = products?.length ? products : mockProducts;
  
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
        ) : productsToDisplay?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-medium text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-500">There are currently no products available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsToDisplay?.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
