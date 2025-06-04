"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from '@/app/ui/components/Button';
import { useRouter } from 'next/navigation';
import { loginUser, initiateSSO } from '@/app/lib/data/platform-api';
import { base_url } from '@/app/lib/utils';
import { useSharedState } from '@/app/ui/components/SharedState/Context';

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState("email")
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { sharedState } = useSharedState();
  const uuid = sharedState?.session?.uuid || null;

  const router = useRouter();

  //TODO: Fix the issue with the login form not being able to redirect to the last visited page
  useEffect(() => {
    if(uuid) {
      router.push('/profile'); // Redirect to login if uuid is not available
      return;
    }
    // Store the current page URL in localStorage
    localStorage.setItem('lastVisitedPage', window.location.href);
  }, [uuid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); 
    try {
      let originalUrl = localStorage.getItem('lastVisitedPage') || '/';
      if (originalUrl.includes('/login')) {
        originalUrl = base_url; 
      }

      const data = await loginUser(email, password, originalUrl);
      if (data?.status === 401) {
        setErrorMessage(data.message); 
        return;
      }

      if (data?.status === 200) {
        setErrorMessage(null); 
        window.location.href = data?.redirectUrl || '/'; 
        return;
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An unexpected error occurred. Please try again."); 
    }
  };

  const handleSSOLogin = async () => {
    setErrorMessage(null); 
    let originalUrl = localStorage.getItem('lastVisitedPage') || '/';
    if (originalUrl.includes('/login')) {
      originalUrl = base_url; 
    }
    try {
      const data = await initiateSSO(originalUrl);
      if (data?.authUrl) {
        window.location.href = data.authUrl; // Redirect to the SSO URL
      } else {
        setErrorMessage("No redirect URL provided by SSO endpoint.");
      }
    } catch (error) {
      console.error("SSO login error:", error);
      setErrorMessage("An error occurred while redirecting to SSO. Please try again.");
    }
  }

  return (
    <div className="w-full ">
      {/* Custom Tabs */}
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full mb-6">
        <button
          onClick={() => setActiveTab("email")}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
            activeTab === "email" ? "bg-white text-gray-900 shadow-sm" : "hover:bg-gray-200"
          }`}
        >
          Email Login
        </button>
        <button
          onClick={() => setActiveTab("staff")}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
            activeTab === "staff" ? "bg-white text-gray-900 shadow-sm" : "hover:bg-gray-200"
          }`}
        >
          UNDP Staff
        </button>
      </div>

      {/* Email Login Tab */}
      {activeTab === "email" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="text-red-500 text-sm font-medium">
              {errorMessage}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2 pb-5">
            <label htmlFor="password" className="text-sm font-medium leading-none">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Button
            type="submit"
            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2  text-black"
          >
            Sign in
          </Button>
        </form>
      )}

      {/* UNDP Staff Tab */}
      {activeTab === "staff" && (
        <div className="space-y-6">
          {errorMessage && (
            <div className="text-red-500 text-sm font-medium">
              {errorMessage}
            </div>
          )}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 relative flex items-center justify-center border-2 border-[#0072bc] bg-[#0072bc] text-white font-bold">
                <div className="text-xs leading-none">
                  <div>U N</div>
                  <div>D P</div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">UNDP Staff Login</h3>
            <p className="text-sm text-gray-500 mb-4">
              For UNDP employees and authorized personnel only. You will be redirected to the organization's single
              sign-on page.
            </p>
          </div>

          <Button
            onClick={handleSSOLogin}
            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
          >
            Continue with UNDP SSO
          </Button>
        </div>
      )}
    </div>
  )
}
