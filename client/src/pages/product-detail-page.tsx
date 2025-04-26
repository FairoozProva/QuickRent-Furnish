import { useParams } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import ProductDetail from "@/components/products/product-detail";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Product ID is missing. Please go back to the products page and try again.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <ProductDetail productId={id} />
    </MainLayout>
  );
}
