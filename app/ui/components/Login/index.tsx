'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/components/Button';
import { initiateSSO } from '@/app/lib/data/auth';
import { base_url } from '@/app/lib/helpers/utils';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import { getCookieConsent } from '@/app/ui/components/CookieConsent';

interface LoginFormProps {
  ssoEnabled: boolean;
  emailAuthEnabled: boolean;
}

export default function LoginForm({ ssoEnabled, emailAuthEnabled }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'email' | 'staff'>('email');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { sharedState } = useSharedState();
  const { uuid } = sharedState?.session || {};

  // Set initial tab based on available auth methods
  useEffect(() => {
    if (!emailAuthEnabled && ssoEnabled) {
      setActiveTab('staff');
    }
  }, [emailAuthEnabled, ssoEnabled]);

  useEffect(() => {
    if(uuid) {
      router.push('/profile');
      return;
    }
    // Store the current page URL in localStorage only if functional cookies are enabled
    const consent = getCookieConsent();
    if (consent?.functional) {
      localStorage.setItem('lastVisitedPage', window.location.href);
    }
  }, [uuid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Only retrieve lastVisitedPage if functional cookies are enabled
      const consent = getCookieConsent();
      let originalUrl = '/';
      if (consent?.functional) {
        originalUrl = localStorage.getItem('lastVisitedPage') || '/';
      }
      if (originalUrl.includes('/login')) {
        originalUrl = base_url; 
      }
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage('Invalid login credentials.');
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Redirect to the original page or home
        const redirectUrl = localStorage.getItem('lastVisitedPage') || '/see';
        localStorage.removeItem('lastVisitedPage');
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsLoading(false);
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
        window.location.href = data.authUrl;
      } else {
        setErrorMessage('No redirect URL provided by SSO endpoint.');
      }
    } catch (error) {
      console.error('SSO login error:', error);
      setErrorMessage('An error occurred while redirecting to SSO. Please try again.');
    }
  };

  // If neither auth method is enabled, show error
  if (!emailAuthEnabled && !ssoEnabled) {
    return (
      <div className="w-full p-4 border border-red-300 bg-red-50 rounded-md">
        <p className="text-red-700">Authentication is currently disabled. Please contact the administrator.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Custom Tabs - Only show if both methods are enabled */}
      {emailAuthEnabled && ssoEnabled && (
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full mb-6">
          <button
            onClick={() => setActiveTab('email')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
              activeTab === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'hover:bg-gray-200'
            }`}
          >
            Email Login
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
              activeTab === 'staff' ? 'bg-white text-gray-900 shadow-sm' : 'hover:bg-gray-200'
            }`}
          >
            UNDP Staff
          </button>
        </div>
      )}

      {/* Email Login Tab */}
      {emailAuthEnabled && activeTab === 'email' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="text-red-500 text-sm font-medium">{errorMessage}</div>
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
              disabled={isLoading}
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
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* <div className="flex items-center space-x-2 pb-3">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="remember" className="text-sm font-medium leading-none">
              Trust this device (stay signed in for 1 year)
            </label>
          </div> */}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 text-black"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      )}

      {/* UNDP Staff Tab */}
      {ssoEnabled && activeTab === 'staff' && (
        <div className="space-y-6">
          {errorMessage && (
            <div className="text-red-500 text-sm font-medium">{errorMessage}</div>
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
              For UNDP employees and authorized personnel only. You will be redirected to the
              organization's single sign-on page.
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
  );
}
