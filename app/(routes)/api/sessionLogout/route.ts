import { adminAuth, adminDb } from "@/app/_lib/firebaseAdmin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const token = (await cookies()).get("session")?.value;
    if (!token) return NextResponse.json({ error: "Invalid session cookie" }, { status: 401 });
    const sessionCookie = await adminAuth.verifySessionCookie(token);
    if (!sessionCookie) return NextResponse.json({ error: "Invalid session cookie" }, { status: 401 });
    await adminAuth.revokeRefreshTokens(sessionCookie.uid);
    const userRef = adminDb.ref("users/" + sessionCookie.uid);
    await userRef.update({ isLoggedIn: false });
    return NextResponse.json({ success: true });
}