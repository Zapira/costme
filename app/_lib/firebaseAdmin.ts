import admin from "firebase-admin";

function initializeFirebase() {
    if (!admin.apps.length) {
        const {
            NEXT_PRIVATE_FIREBASE_PROJECT_ID,
            NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL,
            NEXT_PRIVATE_FIREBASE_PRIVATE_KEY,
            NEXT_PRIVATE_FIREBASE_DATABASE_URL,
        } = process.env;

        if (
            !NEXT_PRIVATE_FIREBASE_PROJECT_ID ||
            !NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL ||
            !NEXT_PRIVATE_FIREBASE_PRIVATE_KEY ||
            !NEXT_PRIVATE_FIREBASE_DATABASE_URL
        ) {
            throw new Error("Firebase environment variables are missing");
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: NEXT_PRIVATE_FIREBASE_PROJECT_ID,
                clientEmail: NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL,
                privateKey: NEXT_PRIVATE_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            }),
            databaseURL: NEXT_PRIVATE_FIREBASE_DATABASE_URL,
        });
    }

    return admin;
}

export function getAdminAuth() {
    return initializeFirebase().auth();
}

export function getAdminDb() {
    return initializeFirebase().database();
}