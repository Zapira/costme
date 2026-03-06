'use client';
import { auth } from "@/app/_lib/firebaseAuth";
import { db } from "@/app/_lib/firebaseDb";
import { historyData } from "@/app/_types/walletType";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LastTransaction() {

    const [data, setData] = useState<historyData[]>([]);
    const [loading, setLoading] = useState(true);

    const getDataHistory = async (uid: string) => {

        try {

            setLoading(true);

            const [incomeSnapshot, expenseSnapshot] = await Promise.all([
                get(ref(db, `users/${uid}/history-income`)),
                get(ref(db, `users/${uid}/history-expense`))
            ]);

            const incomeData = incomeSnapshot.val();
            const expenseData = expenseSnapshot.val();


            if (!incomeSnapshot.exists() && !expenseSnapshot.exists()) {
                setData([]);
                setLoading(false);
                return;
            }

            const historyData = { ...incomeData, ...expenseData };


            const sortedData = (Object.values(historyData) as historyData[]).sort(
                (a: historyData, b: historyData) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            console.log("Sorted History Data:", sortedData);
            setData(sortedData);
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
                await getDataHistory(user.uid);
            } else {
                setData([]);
                setLoading(false);
            }

        });

        return () => unsub();

    }, []);

    const expenseCategories = [
        { id: 1, name: 'Makanan' },
        { id: 2, name: 'Transportasi' },
        { id: 3, name: 'Hiburan' },
        { id: 4, name: 'Belanja' },
        { id: 5, name: 'Tagihan' },
        { id: 6, name: 'Kesehatan' },
        { id: 7, name: 'Pendidikan' },
        { id: 8, name: 'Lainnya' }
    ];

    return (
        <div className="mt-9">

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Transaksi Terbaru</h2>
                <Link href="/transactions" className="text-sm font-bold text-purple-700">
                    Lihat Semua
                </Link>
            </div>

            {loading ? (

                <div className="w-full h-[120px] flex items-center justify-center border-[3px] border-slate-900 rounded-2xl">
                    <div className="w-10 h-10 border-4 border-slate-300 border-t-purple-500 rounded-full animate-spin"></div>
                </div>

            ) : data.length === 0 ? (

                <div className="w-full h-[120px] mt-5 flex items-center justify-center border-[3px] border-slate-900 rounded-2xl">
                    <span className="text-gray-500 font-semibold">
                        Belum ada transaksi
                    </span>
                </div>

            ) : (

                data.slice(0, 5).map((item: historyData, key: number) => {

                    const categoryName =
                        expenseCategories.find(cat => cat.id === Number(item.expenseCategoryId))?.name
                        || "Lainnya";

                    return (
                        <div
                            key={key}
                            className="bg-white border-[3px] border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0_0_rgb(15,23,42)]  mt-3"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-12 h-12 ${item.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'} border-[2px] border-slate-900 rounded-xl flex items-center justify-center text-xl flex-shrink-0`}
                                >
                                    {item.type === 'income' ? '📈' : '💸'}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">
                                        {categoryName}
                                    </p>
                                    <p className="text-xs text-slate-500 font-semibold">
                                        {item.walletName} • {new Date(item.timestamp).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <span
                                    className={`text-base font-black whitespace-nowrap ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}
                                >
                                    {item.type === 'income' ? '+' : '-'} Rp {new Intl.NumberFormat('id-ID').format(item.amount)}
                                </span>
                            </div>
                        </div>
                    )
                })

            )}

        </div>
    );
}