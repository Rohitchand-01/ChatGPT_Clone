import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)', // protects all app routes except static
    '/api/(.*)',              // protects all API routes
  ],
};
