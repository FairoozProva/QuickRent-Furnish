import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="text-sm text-neutral-500">© 2023 FeedbackIQ. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/privacy">
              <a className="text-sm text-neutral-500 hover:text-neutral-700">Privacy Policy</a>
            </Link>
            <Link href="/terms">
              <a className="text-sm text-neutral-500 hover:text-neutral-700">Terms of Service</a>
            </Link>
            <Link href="/help">
              <a className="text-sm text-neutral-500 hover:text-neutral-700">Help Center</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
