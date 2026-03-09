import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const session = req.cookies.get("session")?.value;
    const { pathname } = req.nextUrl;

    const isAuth = !!session;

    // jika belum login dan akses /app
    if (!isAuth && pathname.startsWith("/app")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // jika sudah login dan buka login page
    if (isAuth && pathname === "/login") {
        return NextResponse.redirect(new URL("/app/home", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/app/:path*", "/login"],
};