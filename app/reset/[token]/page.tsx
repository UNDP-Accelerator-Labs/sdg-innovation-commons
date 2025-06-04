import UpdatePassword from "@/app/ui/components/ForgotPassword/UpdatePassword";
import Link from "next/link";
import Navigation from "@/app/ui/components/Navbar";
import { validateToken } from "@/app/lib/data/platform-api";

interface ResetPasswordPageProps {
  params:Promise<{ token: string }>
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = await params;
  let isValidToken = false;

  try {
    const response = await validateToken(token);
    isValidToken = response.status === 200;
  } catch (error) {
    console.error("Error validating token:", error);
  }

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

      {/* Main content */}
      <div className="container mx-auto px-4 py-16 relative z-10 font-space-mono">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
            {isValidToken ? (
              <>
                <p className="text-gray-600">Enter your new password below</p>
                <UpdatePassword token={token} isValidToken={isValidToken} />
              </>
            ) : (
              <p className="text-red-600">Invalid or expired token. Please request a new password reset link.</p>
            )}
          </div>

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
