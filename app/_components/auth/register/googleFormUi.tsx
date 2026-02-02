"use client";

import { auth } from "@/app/_lib/firebaseAuth";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { serverTimestamp, ref, set } from "firebase/database";
import { db } from "@/app/_lib/firebaseDb";
import { motion } from "framer-motion";
import Image from "next/image";
import {  useState } from "react";
import { useAuth } from "@/app/_providers/authProvider";



export default function GoogleFormUI() {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleLogin = async () => {
        setLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });

            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (!user) return;

            const userRef = ref(db, "users/" + user.uid);

            await set(
                userRef,
                {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    provider: "google",
                    createdAt: serverTimestamp(),
                    isLoggedIn: true, // << update status login
                },
            );

            console.log("LOGIN SUCCESS");

            const idToken = await user.getIdToken();
            document.cookie = `token=${idToken}; path=/`;

        } catch (error: any) {
            if (error.code === "auth/popup-closed-by-user") {
                console.log("Popup ditutup user");
            } else {
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };


    const handleLogout = async () => {
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (user) {
                const userRef = ref(db, "users/" + user.uid);
                await set(userRef, { isLoggedIn: false });
            }

            await signOut(auth);
            console.log("LOGOUT SUCCESS");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
            <div className="absolute top-20 left-20 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-60" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="
                    relative z-10
                    w-full max-w-md
                    bg-white/80 backdrop-blur-xl
                    border border-gray-200
                    rounded-2xl
                    shadow-xl
                    px-8 py-10
                "
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Login/Register
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Buat akun baru untuk mulai menggunakan{" "}
                        <span className="font-semibold text-purple-700">
                            COSTME
                        </span>
                    </p>
                </div>

                {user ? (
                    <button
                        onClick={handleLogout}
                        className="w-full px-6 py-4 bg-white border-[3px] border-slate-900 rounded-2xl text-base font-bold text-slate-900 shadow-[6px_6px_0_0_rgb(139,92,246)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[3px_3px_0_0_rgb(139,92,246)] transition-all flex items-center justify-center gap-2"
                    >
                        Logout
                    </button>
                ) : (
                    <motion.button
                        whileHover={!loading ? { scale: 1.04 } : {}}
                        whileTap={!loading ? { scale: 0.96 } : {}}
                        onClick={handleLogin}
                        disabled={loading}
                        className="
                        group relative
                        w-full
                        flex items-center justify-center gap-3
                        px-6 py-3
                        rounded-xl
                        bg-white
                        text-gray-800
                        font-semibold
                        border border-gray-300
                        shadow-sm
                        hover:shadow-md
                        transition-all
                        overflow-hidden
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                    "
                    >
                        <span className="
                        absolute inset-0
                        bg-linear-to-r from-purple-50 to-pink-50
                        opacity-0 group-hover:opacity-100
                        transition
                    " />

                        <span className="relative flex items-center gap-3">
                            {loading ? (
                                <span className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                            ) : (
                                <Image
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="Google"
                                    width={20}
                                    height={20}
                                />
                            )}

                            <span>
                                {loading
                                    ? "Menghubungkan..."
                                    : "Login/Register dengan Google"}
                            </span>
                        </span>
                    </motion.button>
                )}

                <p className="text-xs text-gray-500 text-center mt-6">
                    Dengan mendaftar, kamu menyetujui{" "}
                    <span className="text-purple-600 font-medium">
                        Syarat & Ketentuan
                    </span>{" "}
                    dan{" "}
                    <span className="text-purple-600 font-medium">
                        Kebijakan Privasi
                    </span>
                </p>
            </motion.div>
        </div>
    );
}
