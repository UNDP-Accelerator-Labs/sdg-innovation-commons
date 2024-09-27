import { NextRequest, NextResponse } from "next/server";
const cspLinks = [
  "'self'",
  '*.sdg-innovation-commons.org',
  'sdg-innovation-commons.org',
  'https://translate.google.com',
  'https://translate.googleapis.com',
  'https://translate-pa.googleapis.com',
  'https://unpkg.com',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://www.google.com',
  'https://www.gstatic.com',
  'https://acclabplatforms.blob.core.windows.net',
  'https://a.tile.openstreetmap.org',
  'https://c.tile.openstreetmap.org',
  'https://b.tile.openstreetmap.org',
];

export function middleware(request: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  
    const cspHeader = `
      img-src ${cspLinks.join(' ')};
      script-src ${cspLinks.join(' ')} 'unsafe-inline' 'unsafe-eval';
      style-src ${cspLinks.join(' ')} 'unsafe-inline';
      connect-src ${cspLinks.join(' ')};
      frame-src 'self' https://www.youtube.com/;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, " ").trim();
  
    const response = NextResponse.next();
    response.headers.set("x-nonce", nonce);
    response.headers.set("Content-Security-Policy", cspHeader);
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin, same-origin");
    response.headers.set("Strict-Transport-Security", "max-age=123456");
  
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
  