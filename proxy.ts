import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("session")?.value;
    const { pathname } = req.nextUrl;

    if (!token) {
        if (pathname.startsWith("/app")) {
            const res = NextResponse.redirect(new URL("/", req.url));
            res.cookies.delete("session");
            return res;
        }
    }

    if (token && pathname === "/") {
        return NextResponse.redirect(new URL("/app/home", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/app/:path*"],
};