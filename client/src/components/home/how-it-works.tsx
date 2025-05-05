import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Truck } from "lucide-react";


export default function HowItWorks() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">How It Works</h2>
          <p className="mt-4 text-lg text-gray-500">Renting furniture with us is simple and hassle-free</p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary mb-6">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse & Select</h3>
            <p className="text-base text-gray-500">Browse our curated collection and select the furniture that fits your style and needs.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary mb-6">
              <Calendar className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Duration</h3>
            <p className="text-base text-gray-500">Select your preferred rental duration, starting from 3 months with options to extend.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary mb-6">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Delivery & Setup</h3>
            <p className="text-base text-gray-500">We deliver and set up your furniture at your location, with free assembly and installation.</p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/products">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
