import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // ambil cookie session
    const token = req.cookies.get("session")?.value;

    // validasi token
    const isAuth =
        token &&
        token !== "undefined" &&
        token !== "null" &&
        token.trim() !== "";

    // jika belum login tapi akses halaman app
    if (!isAuth && pathname.startsWith("/app")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // jika sudah login tapi masih di halaman login
    if (isAuth && pathname === "/") {
        return NextResponse.redirect(new URL("/app/home", req.url));
    }

    return NextResponse.next();
}

// route yang diproteksi proxy
export const config = {
    matcher: [
        "/",
        "/app/:path*"
    ],
};