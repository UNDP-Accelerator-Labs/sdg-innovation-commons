import Link from "next/link"
import Navigation from "@/app/ui/components/Navbar";
import { Lock } from "lucide-react"
import Footer from "@/app/ui/components/Footer";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen grid-background relative overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full z-0 pointer-events-none">
        <div className="absolute top-[20%] right-0 w-full">
          <svg viewBox="0 0 300 600" className="w-full">
            <path
              d="M-100,100 C50,50 50,150 150,100 S250,150 350,100 S450,150 550,100"
              fill="none"
              stroke="#0072bc"
              strokeWidth="40"
              opacity="0.2"
              className="animate-pulse-slow"
            />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-0 mt-10">
            <Lock className="h-10 w-10 text-red-600" />
          </div>

          <h1 className="text-4xl font-bold mb-4">
            <span className="slanted-bg yellow">
              <span>401</span>
            </span>{" "}
            Unauthorized
          </h1>

          <p className="text-xl text-gray-700 mb-8">
            You don't have permission to access this page. Please sign in with an authorized account.
          </p>

          <div className="bg-white border border-black border-solid p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Why am I seeing this?</h2>
            <p className="text-gray-700 mb-4">
              This page is restricted to authorized users only. You might be seeing this because:
            </p>
            <ul className="text-left text-gray-700 space-y-2 mb-6">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#d2f960] mt-2 flex-shrink-0"></div>
                <span>You are not logged in</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#d2f960] mt-2 flex-shrink-0"></div>
                <span>Your account doesn't have the required permissions</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#d2f960] mt-2 flex-shrink-0"></div>
                <span>Your session has expired</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/login" className="detach py-2 px-6 relative z-10 text-black font-bold">
              <span className="relative z-10">Sign In</span>
            </Link>
            <Link href="/" className="border border-black py-2 px-6 bg-white hover:bg-gray-100 font-bold">
              Return Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
            <Footer />
    </div>
  )
}
