import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "./app/_lib/firebaseAdmin";

export async function proxy(req: NextRequest) {
    const session = req.cookies.get("session")?.value;
    const { pathname } = req.nextUrl;

    let isAuth = false;

    if (session) {
        try {
            await getAdminAuth().verifySessionCookie(session, true);
            isAuth = true;  
        } catch (error) {
            console.error("SESSION VERIFICATION ERROR:", error);
            isAuth = false;
        }
    }

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