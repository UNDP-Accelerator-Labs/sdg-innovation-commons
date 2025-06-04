import Link from "next/link";
import Navigation from "@/app/ui/components/Navbar";
import ForgotPassword from "@/app/ui/components/ForgotPassword/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-white bg-grid-pattern relative overflow-hidden grid-bg">
      {/* Navigation */}
      <Navigation />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-1/3 h-full z-0 pointer-events-none">
        <div className="absolute top-[20%] left-0 w-full">
          <svg viewBox="0 0 300 600" className="w-full">
            <path
              d="M-100,100 C50,50 50,150 150,100 S250,150 350,100 S450,150 550,100"
              fill="none"
              stroke="#d2f159"
              strokeWidth="40"
              className="animate-pulse-slow"
            />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-1/3 h-full z-0 pointer-events-none">
        <div className="absolute bottom-[10%] right-0 w-full">
          <svg viewBox="0 0 300 600" className="w-full">
            <path
              d="M-100,100 C50,50 50,150 150,100 S250,150 350,100 S450,150 550,100"
              fill="none"
              stroke="#0072bc"
              strokeWidth="40"
              className="animate-pulse-slow"
            />
          </svg>
        </div>
      </div>

      {/* Forgot Password content */}
      <div className="container mx-auto px-4 py-16 relative z-10 font-space-mono">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
            <p className="text-gray-600">Enter your email to reset your password</p>
          </div>

          {/* Client-side ForgotPassword component */}
          <ForgotPassword />

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Remembered your password?{" "}
              <Link href="/login" className="text-[#0072bc] hover:underline">
                Login
              </Link>
            </p>
            <p className="mt-2">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#0072bc] hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
