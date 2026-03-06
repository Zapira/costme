import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {

    const token = req.cookies.get("session")?.value;
    const { pathname } = req.nextUrl;

    if (!token) {

        if (pathname.startsWith("/app")) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    }

    if (token && pathname === "/") {
        return NextResponse.redirect(new URL("/app/home", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/app/:path*"],
};