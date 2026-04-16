import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
export default withAuth(
  function proxy(req) {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isAdminLoginRoute = req.nextUrl.pathname.startsWith("/admin/login");
    if (isAdminRoute && !isAdminLoginRoute && req.nextauth.token?.role !== "admin")
      return NextResponse.redirect(new URL("/admin/login", req.url));
    return NextResponse.next();
  },
  { callbacks: { authorized: ({ token, req }) => {
    if (req.nextUrl.pathname.startsWith("/admin/login")) return true;
    if (req.nextUrl.pathname.startsWith("/admin")) return !!token;
    return true;
  }}}
);
export const config = { matcher: ["/admin/:path*"] };
