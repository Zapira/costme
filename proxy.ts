import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const session = req.cookies.get("session")?.value;
    const { pathname } = req.nextUrl;

    const isAuth = !!session;

    if (!isAuth && pathname.startsWith("/app")) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (isAuth && pathname.startsWith("/auth/login")) {
        return NextResponse.redirect(new URL("/app/home", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/app/:path*", "/auth/:path*"],
};