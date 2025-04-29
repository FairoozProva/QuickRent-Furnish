import Navbar from "@/components/ui/navbar";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      title: "Browse & Select",
      description: "Explore our extensive catalog of high-quality furniture pieces. Filter by category, style, or price to find exactly what you need for your space."
    },
    {
      title: "Choose Your Rental Period",
      description: "Select a rental duration that works for you – from a few months to a year or more. The longer you rent, the more you save."
    },
    {
      title: "Schedule Delivery",
      description: "Select a delivery date that's convenient for you. Our professional logistics team will handle everything."
    },
    {
      title: "Enjoy Your Furniture",
      description: "Our team will deliver, assemble, and set up your furniture exactly where you want it. Then just enjoy your beautiful, functional space."
    },
    {
      title: "Flexible Return or Renewal",
      description: "When your rental period ends, you can either return the furniture (we'll pick it up) or renew your rental for another term."
    }
  ];

  const faqs = [
    {
      question: "What is furniture rental?",
      answer: "Furniture rental is a service that allows you to use high-quality furniture for a specific period of time in exchange for a monthly fee, rather than purchasing it outright. It's a flexible, cost-effective solution for temporary living situations, home staging, or trying out different styles."
    },
    {
      question: "How long can I rent furniture?",
      answer: "We offer flexible rental terms starting from 3 months. You can choose 3, 6, or 12-month rental periods initially, and then extend month-to-month afterward if needed. Longer rental periods come with discounted monthly rates."
    },
    {
      question: "Is delivery included?",
      answer: "Yes, delivery, assembly, and setup are included in our service. Our professional team will deliver and set up your furniture exactly where you want it. At the end of your rental period, we'll also pick up the furniture at no extra cost."
    },
    {
      question: "What if I damage the furniture?",
      answer: "Normal wear and tear is expected and covered. For significant damage, we offer an optional damage waiver program that can be added to your rental for a small monthly fee, which covers most accidental damage."
    },
    {
      question: "Can I change my furniture during the rental period?",
      answer: "Yes, we offer a furniture swap option that allows you to exchange pieces during your rental period for a small fee. This is perfect if your needs change or if you want to refresh your space."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How QuickRent Furnish Works</h1>
            <p className="text-xl text-gray-700 mb-8">
              Renting furniture has never been easier. Follow our simple process to transform your space without the commitment of buying.
            </p>
            <Link href="/products">
              <Button size="lg" className="mr-4">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Steps Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Simple Rental Process</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We've streamlined the furniture rental process to make it quick and hassle-free for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm relative">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-4 mx-auto">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gray-200 -ml-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits of Furniture Rental</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover why thousands of customers choose to rent instead of buy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Flexibility</h3>
              <p className="text-gray-600 mb-6">
                Rent for as long as you need, from months to years. Change your furniture when your taste or needs evolve.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="text-primary h-5 w-5 mt-0.5 mr-2" />
                  <span>No long-term commitment</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-primary h-5 w-5 mt-0.5 mr-2" />
                  <span>Easy to upgrade or exchange pieces</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-primary h-5 w-5 mt-0.5 mr-2" />
                  <span>Perfect for temporary living situations</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Cost-Effective</h3>
              <p className="text-gray-600 mb-6">
                Avoid the large upfront cost of buying furniture while still enjoying high-quality pieces.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="text-primary h-5 w-5 mt-0.5 mr-2" />
                  <span>No large initial investment</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-primary h-5 w-5 mt-0.5 mr-2" />
                  <span>Includes delivery, assembly, and pickup</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-primary h-5 w-5 mt-0.5 mr-2" />
                  <span>No maintenance or repair costs</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Convenience</h3>
              <p className="text-gray-600 mb-6">
                From selection to delivery to pickup, we handle everything to make the process stress-free.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="text-primary h-5 w-5 mt-0.5 mr-2" />
                  <span>White-glove delivery service</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-primary h-5 w-5 mt-0.5 mr-2" />
                  <span>Professional assembly and setup</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-primary h-5 w-5 mt-0.5 mr-2" />
                  <span>Hassle-free pickup when you're done</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our furniture rental service
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-6 bg-gray-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg text-gray-700 mb-6">
              Have a question that's not answered here?
            </p>
            <Button variant="outline" size="lg">Contact Us</Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Start browsing our collection of premium furniture and find the perfect pieces for your home or office.
          </p>
          <Link href="/products">
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100">
              Browse Products
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-xl font-bold mb-4">QuickRent Furnish</h2>
              <p className="text-gray-400 max-w-xs">
                Premium furniture rental solutions for homes and offices
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                  <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
                  <li><Link href="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
                  <li><Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center md:text-left">
            <p className="text-gray-400">© 2023 QuickRent Furnish. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}