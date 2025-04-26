import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
};

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Browse by Category
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our furniture collection by category to find the perfect pieces for your home or office space.
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p>Failed to load categories. Please try again later.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((category) => (
              <Card key={category._id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                  <Button asChild className="w-full">
                    <Link href={`/category/${category.slug}`}>
                      View Products
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}