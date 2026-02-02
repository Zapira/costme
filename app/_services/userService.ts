import { cookies } from "next/headers";
import { adminAuth, adminDb } from "../_lib/firebaseAdmin";

export const getUser = async () => {
    const token = (await cookies()).get("session")?.value;
    if (!token) return null;

    const decodedToken = await adminAuth.verifySessionCookie(token);
    if (!decodedToken) return null;
    const userRef = adminDb.ref("users/" + decodedToken.uid);
    const snapshot = await userRef.get();
    if (!snapshot.exists()) return null;

    return snapshot.val();



    

}