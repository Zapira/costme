'use client'

import { auth } from "@/app/_lib/firebaseAuth";
import { db } from "@/app/_lib/firebaseDb";
import { historyData } from "@/app/_types/walletType";
import { onAuthStateChanged } from "firebase/auth";
import { off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6"

export default function RemainingCard() {

    const monthNow = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date())

    const [data, setData] = useState<historyData[]>([]);
    const [loading, setLoading] = useState(true);

    const getDataIncomeNow = async (uid: string) => {
        try {

            const incomeRef = ref(db, `users/${uid}/history-income`);
            const expenseRef = ref(db, `users/${uid}/history`);

            let incomeData: Record<string, historyData> = {};
            let expenseData: Record<string, historyData> = {};

            const updateData= () => {
                const historyData = { ...incomeData, ...expenseData };

                const sortedData = Object.values(historyData).sort(
                    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );

                setData(sortedData);
                setLoading(false);
            }

            const unsubIncome = onValue(incomeRef, (snap) => {
                incomeData = snap.exists() ? snap.val() : {};
                updateData();
            });

            const unsubExpense = onValue(expenseRef, (snap) => {
                expenseData = snap.exists() ? snap.val() : {};
                updateData();
            });

            return () => {
                off(incomeRef, 'value', unsubIncome);
                off(expenseRef, 'value', unsubExpense);
            };
        } catch (error) {
            console.error("Error fetching history data:", error);
            setData([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await getDataIncomeNow(user.uid);
            } else {
                setLoading(false);
            }
        });
        return () => unsub();
    }, []);


    const totalIncome = data
        ?.filter(item => item.type === "income")
        ?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

    const totalExpense = data
        ?.filter(item => item.type === "expense")
        ?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

    return (

        <div className="grid grid-cols-2 gap-4 mt-5 pr-2">

            {loading ? (
                <>
                    <div className="w-full h-[100px] flex items-center justify-center border-[3px] border-slate-900 rounded-2xl mt-5">
                        <div className="w-10 h-10 border-4 border-slate-300 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                    <div className="w-full h-[100px] flex items-center justify-center border-[3px] border-slate-900 rounded-2xl mt-5">
                        <div className="w-10 h-10 border-4 border-slate-300 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                </>
            ) : (
                <>
                    <div className="w-full border-[3px] border-slate-900 rounded-2xl p-4 sm:p-5 flex items-center gap-3 bg-emerald-100 shadow-[6px_6px_0_0_rgb(15,23,42)] mt-4">

                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white border-[2px] border-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FaArrowTrendUp size={18} className="text-emerald-600 sm:text-[20px]" />
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[11px] sm:text-xs font-bold text-slate-600 mb-1 truncate">
                                Pemasukan {monthNow}
                            </span>

                            <span className="text-base sm:text-lg font-black text-slate-900 truncate">
                                Rp {totalIncome.toLocaleString('id-ID')}
                            </span>
                        </div>

                    </div>


                    <div className="w-full border-[3px] border-slate-900 rounded-2xl p-4 sm:p-5 flex items-center gap-3 bg-rose-100 shadow-[6px_6px_0_0_rgb(15,23,42)] mt-4">

                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white border-[2px] border-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FaArrowTrendDown size={18} className="text-rose-600 sm:text-[20px]" />
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[11px] sm:text-xs font-bold text-slate-600 mb-1 truncate">
                                Pengeluaran {monthNow}
                            </span>

                            <span className="text-base sm:text-lg font-black text-slate-900 truncate">
                                Rp {totalExpense.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </>
            )}

        </div>

    )

}