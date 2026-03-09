"use client";

import { auth } from "@/app/_lib/firebaseAuth";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { ref, set, update } from "firebase/database";
import { db } from "@/app/_lib/firebaseDb";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/app/_providers/authProvider";

export default function GoogleFormUI() {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleLogin = async () => {
        setLoading(true);

        try {
            console.log("START LOGIN");

            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });

            console.log("BEFORE POPUP");
            const result = await signInWithPopup(auth, provider);
            console.log("AFTER POPUP");

            const user = result.user;
            if (!user) {
                console.log("USER NULL");
                return;
            }

            console.log("GETTING ID TOKEN");
            const idToken = await user.getIdToken();
            console.log("ID TOKEN OK");

            console.log("CALLING API");
            const response = await fetch("/api/sessionLogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    idToken,
                    userData: {
                        name: user.displayName,
                        email: user.email
                    }
                }),
            });

            console.log("API RESPONSE:", response.status);

            if (!response.ok) {
                const text = await response.text();
                console.error("API ERROR:", text);
                return;
            }

            console.log("LOGIN SUCCESS");
            window.location.href = "/app/home";

        } catch (error) {
            console.error("LOGIN ERROR:", error);
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
                await update(userRef, { isLoggedIn: false });
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
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md relative z-10 min-h-[80vh] flex flex-col items-center justify-center"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-linear-to-br from-violet-500 to-purple-600 border-[4px] border-slate-900 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-[8px_8px_0_0_rgb(15,23,42)] animate-float">
                        💰
                    </div>
                </div>

                <div className="bg-white border-[4px] border-slate-900 rounded-3xl shadow-[12px_12px_0_0_rgb(15,23,42)] overflow-hidden">
                    <div className="bg-linear-to-br from-violet-500 to-purple-600 px-6 py-6 border-b-[4px] border-slate-900">
                        <h1 className="text-2xl font-black text-white text-center mb-1">
                            Welcome Back! 👋
                        </h1>
                        <p className="text-xs font-semibold text-white/90 text-center">
                            Kelola keuangan dengan <span className="font-black">MYCOST</span>
                        </p>
                    </div>

                    <div className="px-6 py-6">
                        {user ? (
                            <div className="space-y-3">
                                <div className="bg-emerald-100 border-[3px] border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0_0_rgb(15,23,42)]">
                                    <p className="text-xs font-bold text-slate-600 mb-1">Login sebagai</p>
                                    <p className="text-base font-black text-slate-900 truncate">{user.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-5 py-3.5 bg-rose-100 border-[3px] border-slate-900 rounded-2xl text-sm font-bold text-slate-900 shadow-[6px_6px_0_0_rgb(15,23,42)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[3px_3px_0_0_rgb(15,23,42)] transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <motion.button
                                    whileHover={!loading ? { scale: 1.02 } : {}}
                                    whileTap={!loading ? { scale: 0.98 } : {}}
                                    onClick={handleLogin}
                                    disabled={loading}
                                    className="w-full px-5 py-3.5 bg-white border-[3px] border-slate-900 rounded-2xl text-sm font-bold text-slate-900 shadow-[6px_6px_0_0_rgb(15,23,42)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[3px_3px_0_0_rgb(15,23,42)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-4 h-4 rounded-full border-[3px] border-violet-500 border-t-transparent animate-spin" />
                                            <span>Menghubungkan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Image
                                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                                alt="Google"
                                                width={20}
                                                height={20}
                                            />
                                            <span>Login dengan Google</span>
                                        </>
                                    )}
                                </motion.button>

                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-[3px] bg-slate-900"></div>
                                    <span className="text-xs font-bold text-slate-600 uppercase">atau</span>
                                    <div className="flex-1 h-[3px] bg-slate-900"></div>
                                </div>

                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 bg-emerald-100 border-[2px] border-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-base">✓</span>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700">Gratis selamanya</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 bg-cyan-100 border-[2px] border-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-base">🔒</span>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700">Data aman & terenkripsi</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 bg-amber-100 border-[2px] border-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-base">📊</span>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700">Laporan keuangan detail</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <p className="text-[10px] font-semibold text-slate-500 text-center mt-5">
                            Dengan login, kamu menyetujui{" "}
                            <span className="text-violet-600 font-bold">
                                Syarat & Ketentuan
                            </span>{" "}
                            dan{" "}
                            <span className="text-violet-600 font-bold">
                                Kebijakan Privasi
                            </span>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs font-semibold text-slate-600 mt-4">
                    💳 Kelola uang lebih mudah dengan MYCOST
                </p>
            </motion.div>

            <style jsx>{`
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.3; }
        }
        
        .animate-float {
            animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
        }
    `}</style>
        </>

    );
}
