import Navigation from "@/app/ui/components/Navbar"
import RegisterForm from "@/app/ui/components/Register"
import Link from "next/link"
import { Button } from '@/app/ui/components/Button';
import Footer from '@/app/ui/components/Footer';
import platformApi from "@/app/lib/data/platform-api";

export default async function RegisterPage() {

    // Fetch country names and articles in parallel
    const countries =  await platformApi({}, 'experiment', 'countries')

  return (
    <div className="min-h-screen grid-background relative overflow-hidden">
      {/* Navigation */}
      <Navigation />

      <section className='relative home-section !border-t-0 pt-[120px] lg:pt-[40px] lg:pb-[80px]'>
        {/* Decorative elements */}
        <img className='w-[60%] lg:w-[40%] absolute right-0 bottom-0 md:bottom-[-20%] lg:bottom-[-10%] z-0 pointer-events-none' alt="Branding illustration" src="/images/hands/home_bottom.svg" />

      {/* Main content */}
      <div className="container mx-auto px-5 py-16 relative z-10 mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Promotional content */}
          <div className="space-y-0">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Join the{" "}
                <span className="slanted-bg yellow">
                  <span>Innovation</span>
                </span>{" "}
                Community
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Connect with development practitioners, share insights, and contribute to meaningful change through
                collaborative innovation.
              </p>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold mb-4">Why get involved?</h2>

              <div className="space-y-0 my-0 py-0">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#d2f960] mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <strong>Become a member of the community</strong> and connect with like-minded professionals working
                    on sustainable development
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#d2f960] mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <strong>Reach to other active members</strong> to find out more about innovations and best practices
                    in development work
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#d2f960] mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <strong>Become a curator of mood boards</strong> for development practitioners and help shape the
                    future of innovation
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#d2f960] mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    <strong>Make your voice heard</strong> by an international organization committed to sustainable
                    development
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-black border-solid p-6">
              <h3 className="font-bold mb-2 font-space-mono">Already have an account?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Sign in to explore.
              </p>
              <Button
                className="inline-block  px-4 py-0"
              >
                <Link href="/login" >
                  Sign In
                </Link>
              </Button>
            </div>
          </div>

          {/* Right side - Registration form */}
          <div className="lg:pl-8 flex items-center justify-center h-full">
            <div className="bg-white border border-black border-solid p-8 max-w-md w-full lg:w-auto">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Create Account</h2>
                <p className="text-gray-600">Join the innovation community</p>
              </div>

              <RegisterForm countries={countries} />
            </div>
          </div>
        </div>
      </div>
      </section>
      <Footer />
    </div>
  )
}
