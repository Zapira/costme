import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "../_lib/firebaseAdmin";

export const getUser = async () => {
    const token = (await cookies()).get("session")?.value;
    if (!token) return null;

    const decodedToken = await getAdminAuth().verifySessionCookie(token);
    if (!decodedToken) return null;
    const userRef = getAdminDb().ref("users/" + decodedToken.uid);
    const snapshot = await userRef.get();
    if (!snapshot.exists()) return null;

    return snapshot.val();
}