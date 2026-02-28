import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("session");
    const { pathname } = req.nextUrl;

    const isAuth = !!token;

    if (isAuth && pathname === "/") {
        return NextResponse.redirect(new URL("/app/home", req.url));
    }

    if (!isAuth && pathname.startsWith("/app")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}