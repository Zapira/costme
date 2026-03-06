'use client'

import { auth } from "@/app/_lib/firebaseAuth";
import { db } from "@/app/_lib/firebaseDb";
import { historyData } from "@/app/_types/walletType";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6"

export default function RemainingCard() {

    const monthNow = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date())

    const [data, setData] = useState<historyData[]>([]);
    const [loading, setLoading] = useState(true);

    const getDataIncomeNow = async (uid: string) => {
        try {

            const historyRef = ref(db, `users/${uid}/history`);
            const snapshot = await get(historyRef);

            if (!snapshot.exists()) {
                setData([]);
                setLoading(false);
                return;
            }

            const historyData = snapshot.val();

            const filteredData: historyData[] = (Object.values(historyData) as historyData[])
                .filter((item: historyData) =>
                    item?.type === "income" || item?.type === "expense"
                );

            const sortedData = filteredData.sort(
                (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            const walletNamesRef = ref(db, `users/${uid}/wallets`);
            const walletNamesSnapshot = await get(walletNamesRef);
            const walletNamesData = walletNamesSnapshot.val();

            const enrichedData = sortedData.map((item) => {

                const walletName =
                    walletNamesData?.[item.walletId]?.name || "Unknown Wallet";

                return {
                    ...item,
                    walletName,
                    amount: Number(item.amount) || 0
                };
            });

            setData(enrichedData);
            setLoading(false);

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

        <div className="flex justify-between space-x-3 pr-2">

            {loading ? (

                <div className="w-full h-[100px] flex items-center justify-center border-[3px] border-slate-900 rounded-2xl mt-5">
                    <div className="w-10 h-10 border-4 border-slate-300 border-t-purple-500 rounded-full animate-spin"></div>
                </div>

            ) : (

                <>

                    <div className="w-full border-[3px] border-slate-900 rounded-2xl p-5 flex items-center gap-3 mt-4 bg-emerald-100 shadow-[6px_6px_0_0_rgb(15,23,42)]">
                        <div className="w-10 h-10 bg-white border-[2px] border-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FaArrowTrendUp size={20} className="text-emerald-600" />
                        </div>

                        <div className="flex flex-col flex-1">
                            <span className="text-xs font-bold text-slate-600 mb-1">Pemasukan {monthNow}</span>
                            <span className="text-lg font-black text-slate-900">
                                Rp {totalIncome.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    <div className="w-full border-[3px] border-slate-900 rounded-2xl p-5 flex items-center gap-3 mt-4 bg-rose-100 shadow-[6px_6px_0_0_rgb(15,23,42)]">
                        <div className="w-10 h-10 bg-white border-[2px] border-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FaArrowTrendDown size={20} className="text-rose-600" />
                        </div>

                        <div className="flex flex-col flex-1">
                            <span className="text-xs font-bold text-slate-600 mb-1">Pengeluaran {monthNow}</span>
                            <span className="text-lg font-black text-slate-900">
                                Rp {totalExpense.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                </>

            )}

        </div>

    )

}