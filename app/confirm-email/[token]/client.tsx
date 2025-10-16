'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/app/ui/components/Navbar';
import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { confirmEmail, registerContributor } from '@/app/lib/data/platform-api';
import Footer from '@/app/ui/components/Footer';

export default function ConfirmEmailClient({ token }: { token: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState<string>("")

  // Check if new_user query param is present
  const urlParams = new URLSearchParams(window.location.search);
  const new_user = urlParams.get('new_user') === 'true';
  
  useEffect(() => {
    const verifyEmail = async () => {
      console.log('Verifying email with token:', token);
      if (!token) {
        setStatus('error');
        setMessage('Invalid confirmation link');
        return;
      }

      try {
        const response = new_user ? await registerContributor(token) : await confirmEmail(token);

        if (response?.status === 200) {
          setStatus('success');
          setMessage(response.message);
          // Redirect after a delay to show the success message
          setTimeout(() => {
            router.push('/login');
          }, 5000);
        } else {
          setStatus('error');
          setMessage(response?.message || 'Failed to confirm email');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while confirming your email');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <>
      <section className="home-section grid-bg relative !border-t-0 pt-[120px] lg:pb-[80px] lg:pt-0">
        {/* Navigation */}
        <Navigation />
        <img
          className="absolute right-0 top-[170px] w-[80%] lg:top-[120px] lg:w-[40%]"
          alt="Branding illustration"
          src="/images/hands/test_top.svg"
        />
        <img
          className="absolute bottom-0 right-[30%] w-[60%] md:right-[60%] lg:right-[10%] lg:w-[30%]"
          alt="Branding illustration"
          src="/images/hands/test_bottom.svg"
        />

        {/* Main content */}
        <div className="container relative z-10 mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl">
            <div className="border border-solid border-black bg-white p-8 text-center">
              {status === 'loading' && (
                <div className="space-y-6">
                  <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                    <Loader2 className="h-10 w-10 animate-spin text-[#0072bc]" />
                  </div>
                  <h1 className="text-2xl font-bold">Confirming Your Email</h1>
                  <p className="text-gray-600">
                    Please wait while we verify your email address...
                  </p>
                </div>
              )}

              {status === 'success' && (
                <div className="space-y-6">
                  <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold">Email Confirmed!</h1>
                  <p className="text-gray-600">{message}</p>
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <p className="mb-4 text-gray-600">
                      You will be redirected to the login page in a few
                      seconds...
                    </p>
                    <Link
                      href="/login"
                      className="detach relative z-10 inline-block px-6 py-2 font-bold text-black"
                    >
                      <span className="relative z-10">Sign In Now</span>
                    </Link>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="space-y-6">
                  <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                    <XCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h1 className="text-2xl font-bold">Confirmation Failed</h1>
                  <p className="text-gray-600">{message}</p>
                  <div className="mt-6 space-y-6 border-t border-gray-200 pt-6">
                    <div className="rounded-md bg-gray-50 p-4">
                      <h3 className="mb-2 font-bold">What can you do?</h3>
                      <ul className="space-y-2 text-left text-gray-700">
                        <li className="flex items-start space-x-3">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 bg-[#d2f960]"></div>
                          <span>
                            Check if you clicked the correct link from your
                            email
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 bg-[#d2f960]"></div>
                          <span>
                            The confirmation link may have expired (valid for 24
                            hours)
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 bg-[#d2f960]"></div>
                          <span>
                            Request a new confirmation email if needed
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                      <Button>
                        <Link
                          href="/"
                          className="border border-black px-6 py-2"
                        >
                          Return Home
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
