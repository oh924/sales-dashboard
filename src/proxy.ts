import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === "ADMIN";

  if (nextUrl.pathname === "/") {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin/dashboard" : "/dashboard", nextUrl)
    );
  }

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (!isAdmin) return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (nextUrl.pathname === "/dashboard") {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (nextUrl.pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin/dashboard" : "/dashboard", nextUrl)
    );
  }
});

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/admin/:path*"],
};
