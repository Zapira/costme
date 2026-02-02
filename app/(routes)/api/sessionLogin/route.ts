import { adminDb, adminAuth } from "@/app/_lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { idToken, userData } = await req.json();

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    await adminDb.ref(`users/${uid}`).set({
        uid,
        name: userData.name,
        email: userData.email,
        provider: "google",
        createdAt: Date.now(),
        isLoggedIn: true,
    });

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: 5 * 24 * 60 * 60 * 1000 });

    const res = NextResponse.json({ status: "success" });
    res.cookies.set("session", sessionCookie, { httpOnly: true, path: "/", secure: true, maxAge: 5 * 24 * 60 * 60 });

    return res;
}
