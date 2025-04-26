import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import sofaImage from '@/assets/Sofa Set 2.jpeg';

export default function Hero() {
  return (
    <div className="relative bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Rent Premium</span>
                <span className="block text-primary">Furniture Today</span>
              </h1>
              <p className="mt-6 text-lg text-gray-500 max-w-3xl">
                Transform your space without the commitment. Our furniture rental service offers high-quality pieces delivered to your door with flexible rental periods.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/products">Browse Collection</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/how-it-works">How It Works</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <img 
                src={sofaImage}
                alt="Modern living room with stylish sofa" 
                className="rounded-lg shadow-lg h-full w-full object-cover object-center" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
