import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "./app/_lib/firebaseAdmin";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("session");
    const { pathname } = req.nextUrl;

    let isAuth = false;

    console.log(token?.value);

    if (token) {
        try {
            await adminAuth.verifySessionCookie(token.value);
            isAuth = true;
        } catch (err) {
            isAuth = false;
        }
    }

    if (isAuth && pathname === "/") return NextResponse.redirect("/app/home");
    if (!isAuth && pathname.startsWith("/app")) return NextResponse.redirect("/");

    return NextResponse.next();
}

