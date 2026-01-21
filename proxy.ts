import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import jwt from "jsonwebtoken";

const { APP_SECRET } = process.env;

const cspLinks = [
  "'self'",
  '*.sdg-innovation-commons.org',
  'sdg-innovation-commons.org',
  'https://www.undp.org',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://acclabplatforms.blob.core.windows.net',
];

// Routes that require authentication
const protectedRoutes = [
  '/admin',
  '/next-practices/create',
];

// Exact match routes that require authentication
const exactProtectedRoutes = [
  '/profile',
];

// Routes that should redirect if already logged in
const authRoutes = [
  '/login',
  '/register',
];

export async function proxy(request: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const currentPath = request.nextUrl.pathname;

    // Check if this is an API route that requires token authentication
    const isApiRoute = currentPath.startsWith('/api/');
    const publicApiRoutes = [
      '/api/auth/',
      '/api/doc',
      '/api/swagger',
      '/api/og',
    ];
    const isPublicApiRoute = publicApiRoutes.some(route => currentPath.startsWith(route));

    // If it's an API route (not public), check for Bearer token if provided
    if (isApiRoute && !isPublicApiRoute) {
      const authHeader = request.headers.get('authorization');
      
      // Only validate if Bearer token is provided
      // If no token, let the request through - the endpoint will check session auth
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        
        try {
          const decoded = jwt.verify(token, APP_SECRET || 'fallback-secret-key') as any;
          
          // Validate token type
          if (decoded.type === 'api_access') {
            // Add user info to headers for API routes to use
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-api-user-uuid', decoded.uuid);
            requestHeaders.set('x-api-user-email', decoded.email || '');
            requestHeaders.set('x-api-user-rights', decoded.rights?.toString() || '1');
            requestHeaders.set('x-api-authenticated', 'true');
            
            const response = NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            });
            
            return response;
          } else {
            return NextResponse.json(
              { error: 'Invalid API token type' },
              { status: 401 }
            );
          }
        } catch (error) {
          return NextResponse.json(
            { error: 'Invalid or expired API token' },
            { status: 401 }
          );
        }
      }
      // If no Bearer token provided, continue to endpoint (will use session auth)
    }

    // Check authentication for protected routes using NextAuth
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
    const isExactProtectedRoute = exactProtectedRoutes.includes(currentPath);
    const isAuthRoute = authRoutes.some(route => currentPath.startsWith(route));
    
    // Get NextAuth session
    const session = await auth();
    const isAuthenticated = !!session?.user;

    // Redirect to login if accessing protected route without authentication
    if ((isProtectedRoute || isExactProtectedRoute) && !isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', currentPath);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect to home if accessing auth routes while already authenticated
    if (isAuthRoute && isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const cspHeader = `
      img-src ${cspLinks.join(' ')};
      script-src ${cspLinks.join(' ')} 'nonce-${nonce}' 'strict-dynamic' https: http: ${
      process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
    };
      style-src ${cspLinks.join(' ')} 'nonce-${nonce}';
      connect-src ${cspLinks.join(' ')};
      frame-src 'self' https://www.youtube.com/;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, " ").trim();
  
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set('x-current-path', `${currentPath}`);
    requestHeaders.set('x-authenticated', isAuthenticated.toString());

    requestHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin, same-origin");
    requestHeaders.set("Strict-Transport-Security", "max-age=123456");
    requestHeaders.set(
      "Content-Security-Policy",
      cspHeader,
    );

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  }
  
  export const config = {
    matcher: [
      {
        source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
        missing: [
          { type: "header", key: "next-router-prefetch" },
          { type: "header", key: "purpose", value: "prefetch" },
        ],
      },
    ],
  };
  