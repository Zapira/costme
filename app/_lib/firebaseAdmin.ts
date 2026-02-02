import admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.NEXT_PRIVATE_FIREBASE_PROJECT_ID,
            clientEmail: process.env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        databaseURL: process.env.NEXT_PRIVATE_FIREBASE_DATABASE_URL,
    });
}

export const adminAuth = admin.auth();
export const adminDb = admin.database();
