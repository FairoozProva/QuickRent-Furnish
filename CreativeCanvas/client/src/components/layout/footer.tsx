import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">FurnishRent</h3>
            <p className="text-gray-300 text-sm">Premium furniture rental service for modern living. Transform your space without the commitment.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-white">Products</Link></li>
              <li><Link href="/categories" className="text-gray-300 hover:text-white">Categories</Link></li>
              <li><Link href="/how-it-works" className="text-gray-300 hover:text-white">How It Works</Link></li>
              <li><Link href="/faqs" className="text-gray-300 hover:text-white">FAQs</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/sofa-set" className="text-gray-300 hover:text-white">Sofa Sets</Link></li>
              <li><Link href="/category/bedroom" className="text-gray-300 hover:text-white">Bedroom</Link></li>
              <li><Link href="/category/dining" className="text-gray-300 hover:text-white">Dining</Link></li>
              <li><Link href="/category/living" className="text-gray-300 hover:text-white">Living</Link></li>
              <li><Link href="/category/study" className="text-gray-300 hover:text-white">Study</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">123 Furniture Street, Mumbai, India 400001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-300">+91 9876543210</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-300">contact@furnishrent.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">© {new Date().getFullYear()} FurnishRent. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-gray-300 hover:text-white text-sm">Terms of Service</Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white text-sm">Privacy Policy</Link>
            <Link href="/cookie" className="text-gray-300 hover:text-white text-sm">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
