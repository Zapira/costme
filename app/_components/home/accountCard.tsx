'use client';
import { auth } from "@/app/_lib/firebaseAuth";
import { db } from "@/app/_lib/firebaseDb";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get, onValue } from "firebase/database";
import { useEffect, useState } from "react";

export default function AccountCard() {
    const [totalBalance, setTotalBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const totalBalanceRef = ref(db, `users/${user.uid}/totalBalance`);

                const unsubValue = onValue(totalBalanceRef, (snapshot) => {
                    setTotalBalance(snapshot.exists() ? snapshot.val() : 0);
                    setLoading(false);
                });

                return () => unsubValue();
            } else {
                setLoading(false);
            }
        });

        return () => unsubAuth(); 
    }, []);

    return (
        <div className="mt-6 flex justify-center pr-2">

            {loading ? (
                <div className="w-full h-[200px] flex items-center justify-center border-[3px] border-slate-900 rounded-2xl">
                    <div className="w-10 h-10 border-4 border-slate-300 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div
                    className="relative w-full h-[200px] rounded-2xl overflow-hidden border-[3px] border-slate-900"
                    style={{
                        background: "linear-gradient(135deg, #a855f7 0%, #ec4899 60%, #f97316 100%)",
                        boxShadow: "6px 6px 0px 0px #1e1b4b",
                    }}
                >

                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.6) 0%, transparent 60%)",
                        }}
                    />

                    <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10 border-[20px] border-white" />
                    <div className="absolute -right-4 -bottom-10 w-32 h-32 rounded-full opacity-10 border-[16px] border-white" />

                    <div
                        className="absolute top-5 right-5 w-9 h-7 rounded-md border-2 border-white/40"
                        style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))",
                            backdropFilter: "blur(4px)",
                        }}
                    >
                        <div className="w-full h-1/2 border-b border-white/30 flex">
                            <div className="w-1/2 border-r border-white/30" />
                        </div>
                    </div>

                    <div className="relative h-full flex flex-col justify-between p-5">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">
                                Sisa Saldo
                            </p>

                            <h2 className="text-3xl font-extrabold text-white drop-shadow-sm">
                                Rp {totalBalance.toLocaleString("id-ID")}
                            </h2>
                        </div>

                        <div className="flex justify-between items-end">
                            <span className="text-base font-black text-white tracking-tight">
                                MYCOST
                            </span>

                            <div className="text-right">
                                <p className="text-[10px] text-white/50 mb-0.5 font-medium tracking-widest uppercase">
                                    No. Kartu
                                </p>

                                <span className="text-sm font-bold text-white/90 tracking-widest font-mono">
                                    •••• 2451
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}