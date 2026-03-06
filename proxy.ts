import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const session = req.cookies.get("session")?.value;
    const { pathname } = req.nextUrl;

    let isAuth = false;

    if (session) {
        try {
            const payload = JSON.parse(
                Buffer.from(session.split(".")[1], "base64").toString()
            );

            if (payload.aud === "costme-c141c") {
                isAuth = true;
            }
        } catch (e) {
            isAuth = false;
        }
    }

    if (!isAuth && pathname.startsWith("/app")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (isAuth && pathname === "/") {
        return NextResponse.redirect(new URL("/app/home", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/app/:path*"],
};