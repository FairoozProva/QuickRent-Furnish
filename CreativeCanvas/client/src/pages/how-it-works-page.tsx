import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Search, Calendar, Truck, CreditCard, ArrowLeft, ArrowRight, RefreshCw, Phone } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">How FurnishRent</span>
              <span className="block text-primary">Works for You</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Renting furniture with us is simple, affordable, and hassle-free. Follow these easy steps to transform your space.
            </p>
          </div>
        </div>
      </div>
      
      {/* Process Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Our Simple Process</h2>
          <p className="mt-4 text-lg text-gray-600">Follow these four simple steps to get started with FurnishRent</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute -mt-16 ml-20 w-8 h-8 bg-primary-50 rounded-full border-4 border-white text-center text-primary font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Browse & Select</h3>
            <p className="text-gray-600">
              Explore our wide range of premium furniture and select the pieces that match your style and requirements.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute -mt-16 ml-20 w-8 h-8 bg-primary-50 rounded-full border-4 border-white text-center text-primary font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Duration</h3>
            <p className="text-gray-600">
              Select your rental duration starting from 3 months. Longer durations offer better monthly rates.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute -mt-16 ml-20 w-8 h-8 bg-primary-50 rounded-full border-4 border-white text-center text-primary font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Payment</h3>
            <p className="text-gray-600">
              Review your order, sign the rental agreement, and complete the secure payment process.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute -mt-16 ml-20 w-8 h-8 bg-primary-50 rounded-full border-4 border-white text-center text-primary font-bold">
              4
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delivery & Setup</h3>
            <p className="text-gray-600">
              We'll deliver and set up your furniture at your location within 3-5 business days, free of charge.
            </p>
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Benefits of Renting with Us</h2>
            <p className="mt-4 text-lg text-gray-600">Why our customers love the FurnishRent experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <RefreshCw className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Flexibility</h3>
              <p className="text-gray-600">
                Upgrade, swap, or return furniture as your needs change. Extend your rental period with just a few clicks.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <CreditCard className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cost-Effective</h3>
              <p className="text-gray-600">
                Avoid large upfront investments. Renting is more budget-friendly than buying expensive furniture outright.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <Truck className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Free Delivery & Assembly</h3>
              <p className="text-gray-600">
                We handle all the heavy lifting. Our team will deliver, assemble, and set up your furniture at no extra cost.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-600">Find answers to common questions about our furniture rental service</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What is the minimum rental period?</h3>
            <p className="text-gray-600">
              The minimum rental period is 3 months. We offer flexible options to extend your rental for as long as you need.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I swap furniture during my rental period?</h3>
            <p className="text-gray-600">
              Yes, you can swap furniture for a small fee if your needs change during the rental period. Contact our customer support for assistance.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens if the furniture gets damaged?</h3>
            <p className="text-gray-600">
              We understand that accidents happen. Minor wear and tear is covered, but significant damage may incur additional charges as per the rental agreement.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How does the delivery process work?</h3>
            <p className="text-gray-600">
              After placing your order, our team will contact you to schedule a delivery time. We'll deliver and set up the furniture at your location within 3-5 business days.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
            <p className="text-gray-600">
              We accept all major credit and debit cards, UPI, net banking, and wallet payments for a seamless rental experience.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I buy the furniture after renting?</h3>
            <p className="text-gray-600">
              Yes, we offer a rent-to-own option. A portion of your rental payments can be applied toward the purchase price if you decide to buy.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Transform Your Space?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Browse our premium furniture collection and start creating your dream living space today with our hassle-free rental service.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/products">
                  Browse Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="gap-2">
                <Phone className="h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
