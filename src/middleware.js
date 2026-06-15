import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // Protect all /api/admin routes (JSON response)
    if (pathname.startsWith("/api/admin")) {
      if (!req.nextauth.token?.isAdmin) {
        return new NextResponse(
          JSON.stringify({ error: "Unauthorized. Admin access required." }),
          { status: 401, headers: { 'content-type': 'application/json' } }
        );
      }
    }

    // Protect all /admin frontend routes (Redirect response)
    if (pathname.startsWith("/admin")) {
      if (!req.nextauth.token?.isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      // Return true if the user is logged in (token exists), false otherwise.
      // The middleware function above will only run if authorized returns true.
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/api/admin/:path*",
    "/admin/:path*"
  ],
};
