import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token");
    const { pathname } = req.nextUrl;

    let isAuth = false;

    if (token) {
        try {
            await admin.auth().verifyIdToken(token.value);
            isAuth = true;
        } catch (err) {
            isAuth = false;
        }
    }

    if (isAuth && pathname === "/") return NextResponse.redirect("/app/home");
    if (!isAuth && pathname.startsWith("/app")) return NextResponse.redirect("/");

    return NextResponse.next();
}
