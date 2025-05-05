import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


export default function Header() {
  const [location] = useLocation();
  
  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <MessageSquare className="h-5 w-5 text-primary-600 mr-2" />
              <span className="font-semibold text-lg">FeedbackIQ</span>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/dashboard">
                <a className={cn(
                  "border-b-2 px-1 pt-1 font-medium text-sm",
                  location === "/dashboard"
                    ? "text-primary-600 border-primary-600"
                    : "border-transparent hover:border-neutral-300 text-neutral-600 hover:text-neutral-800"
                )}>
                  Dashboard
                </a>
              </Link>
              <Link href="/feedback">
                <a className={cn(
                  "border-b-2 px-1 pt-1 font-medium text-sm",
                  location === "/feedback"
                    ? "text-primary-600 border-primary-600"
                    : "border-transparent hover:border-neutral-300 text-neutral-600 hover:text-neutral-800"
                )}>
                  Feedback
                </a>
              </Link>
              <Link href="/analytics">
                <a className={cn(
                  "border-b-2 px-1 pt-1 font-medium text-sm",
                  location === "/analytics"
                    ? "text-primary-600 border-primary-600"
                    : "border-transparent hover:border-neutral-300 text-neutral-600 hover:text-neutral-800"
                )}>
                  Analytics
                </a>
              </Link>
              <Link href="/reports">
                <a className={cn(
                  "border-b-2 px-1 pt-1 font-medium text-sm",
                  location === "/reports"
                    ? "text-primary-600 border-primary-600"
                    : "border-transparent hover:border-neutral-300 text-neutral-600 hover:text-neutral-800"
                )}>
                  Reports
                </a>
              </Link>
              <Link href="/settings">
                <a className={cn(
                  "border-b-2 px-1 pt-1 font-medium text-sm",
                  location === "/settings"
                    ? "text-primary-600 border-primary-600"
                    : "border-transparent hover:border-neutral-300 text-neutral-600 hover:text-neutral-800"
                )}>
                  Settings
                </a>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center">
            <Button variant="outline" className="ml-4 bg-primary-50 text-primary-700 px-3 py-2 flex items-center">
              <span className="w-4 h-4 mr-1">+</span>
              New Feedback
            </Button>
            <div className="ml-4 flex items-center">
              <button className="rounded-full bg-neutral-200 p-1 text-neutral-500 focus:outline-none">
                <span className="i-material-icons text-sm">notifications</span>
              </button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarFallback className="bg-primary-600 text-white">JD</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
