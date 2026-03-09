import { getAdminAuth, getAdminDb } from "@/app/_lib/firebaseAdmin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
        return NextResponse.json({ error: "Invalid session cookie" }, { status: 401 });
    }

    const sessionCookie = await getAdminAuth().verifySessionCookie(token);

    if (!sessionCookie) {
        return NextResponse.json({ error: "Invalid session cookie" }, { status: 401 });
    }

    await getAdminAuth().revokeRefreshTokens(sessionCookie.uid);

    const userRef = getAdminDb().ref("users/" + sessionCookie.uid);
    await userRef.update({ isLoggedIn: false });

    const response = NextResponse.json({ success: true });

    response.cookies.delete('session');

    return response;
}