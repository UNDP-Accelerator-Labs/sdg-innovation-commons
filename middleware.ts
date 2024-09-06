import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/lib/session";

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
  const isProd = process.env.NODE_ENV === 'production';
 
const cspHeader = `
  img-src ${cspLinks.join(' ')};
  script-src ${cspLinks.join(' ')} 'nonce-${nonce}' sha256-NNiElek2Ktxo4OLn2zGTHHeUR6b91/P618EXWJXzl3s= strict-dynamic https://gc.zgo.at ${isProd ? "" : "'unsafe-eval'"};
  script-src-attr 'self' *.sdg-innovation-commons.org sdg-innovation-commons.org;
  style-src ${cspLinks.join(' ')};
  connect-src ${cspLinks.join(' ')} https://sdg-innovation-commons.goatcounter.com/count;
  frame-src 'self' *.sdg-innovation-commons.org sdg-innovation-commons.org https://www.youtube.com/ https://youtube.com/ https://web.microsoftstream.com;
  form-action 'self' *.sdg-innovation-commons.org sdg-innovation-commons.org;
  base-uri 'self';
  object-src 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();


  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  // Set CSP and other security headers
  requestHeaders.set("Content-Security-Policy", cspHeader);
  requestHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin, same-origin");
  requestHeaders.set("Strict-Transport-Security", "max-age=123456");

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

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
