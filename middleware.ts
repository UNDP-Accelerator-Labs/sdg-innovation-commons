import { NextRequest, NextResponse } from "next/server";
const cspLinks = [
  "'self'",
  '*.sdg-innovation-commons.org',
  'sdg-innovation-commons.org',
  'https://www.undp.org',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://acclabplatforms.blob.core.windows.net',
];

export async function middleware(request: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
    const currentPath = request.nextUrl.pathname;

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

    requestHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin, same-origin");
    requestHeaders.set("Strict-Transport-Security", "max-age=123456");
    requestHeaders.set(
      "Content-Security-Policy",
      cspHeader,
    );

    // // Ensure the Cookie header remains intact
    // if (request.headers.has("cookie")) {
    //     const cookies = request.headers.get("cookie");
    //     requestHeaders.set("cookie", cookies || "");
    // }

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
  