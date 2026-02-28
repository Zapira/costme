export const runtime = "nodejs";

import { getAdminAuth, getAdminDb } from "@/app/_lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { idToken, userData } = await req.json();

    const decodedToken = await getAdminAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    await getAdminDb().ref(`users/${uid}`).set({
        uid,
        name: userData.name,
        email: userData.email,
        provider: "google",
        createdAt: Date.now(),
        isLoggedIn: true,
    });

    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, { expiresIn: 5 * 24 * 60 * 60 * 1000 });

    const res = NextResponse.json({ status: "success" });
    res.cookies.set("session", sessionCookie, { httpOnly: true, path: "/", secure: true, maxAge: 5 * 24 * 60 * 60 });

    return res;
}
