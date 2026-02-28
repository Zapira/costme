import { getAdminAuth, getAdminDb } from "@/app/_lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {

        const { idToken, userData } = await req.json();

        console.log("VERIFYING TOKEN");

        const decodedToken = await getAdminAuth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        console.log("WRITING TO DB");

        await getAdminDb().ref(`users/${uid}`).set({
            uid,
            name: userData.name,
            email: userData.email,
            provider: "google",
            createdAt: Date.now(),
            isLoggedIn: true,
        });

        console.log("CREATING SESSION COOKIE");

        const sessionCookie = await getAdminAuth().createSessionCookie(
            idToken,
            { expiresIn: 5 * 24 * 60 * 60 * 1000 }
        );

        const res = NextResponse.json({ status: "success" });

        res.cookies.set("session", sessionCookie, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 5 * 24 * 60 * 60,
        });

        return res;

    } catch (error: any) {
        console.error("SESSION LOGIN ERROR:", error);

        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}