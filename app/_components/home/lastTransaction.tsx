'use client';
import { auth } from "@/app/_lib/firebaseAuth";
import { db } from "@/app/_lib/firebaseDb";
import { historyData, WalletType } from "@/app/_types/walletType";
import { onAuthStateChanged } from "firebase/auth";
import { off, onValue, ref } from "firebase/database";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LastTransaction() {

    const [data, setData] = useState<historyData[]>([]);
    const [loading, setLoading] = useState(true);

    const getDataHistory = (uid: string) => {
        setLoading(true);

        const incomeRef = ref(db, `users/${uid}/history-income`);
        const expenseRef = ref(db, `users/${uid}/history`);
        const walletsRef = ref(db, `users/${uid}/wallets`);

        let incomeData: Record<string, historyData> = {};
        let expenseData: Record<string, historyData> = {};
        let walletsData: Record<string, WalletType> = {};

        const updateData = () => {
            const historyData = { ...incomeData, ...expenseData };

            const updatedHistoryData = Object.entries(historyData).reduce((acc, [key, item]) => {
                const walletName =
                    walletsData && walletsData[item.walletId]
                        ? walletsData[item.walletId].name
                        : "Dompet Sudah Dihapus";
                acc[key] = { ...item, walletName };
                return acc;
            }, {} as Record<string, historyData>);

            const sortedData = Object.values(updatedHistoryData).sort(
                (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            setData(sortedData);
            setLoading(false);
        };

        const unsubIncome = onValue(incomeRef, (snap) => {
            incomeData = snap.exists() ? snap.val() : {};
            updateData();
        });

        const unsubExpense = onValue(expenseRef, (snap) => {
            expenseData = snap.exists() ? snap.val() : {};
            updateData();
        });

        const unsubWallets = onValue(walletsRef, (snap) => {
            walletsData = snap.exists() ? snap.val() : {};
            updateData();
        });

        return () => {
            off(incomeRef, "value", unsubIncome);
            off(expenseRef, "value", unsubExpense);
            off(walletsRef, "value", unsubWallets);
        };
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
        <div className="mt-9 mb-16">

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Transaksi Terbaru</h2>
                <Link href="/app/history" className="text-sm font-bold text-purple-700">
                    Lihat Semua
                </Link>
            </div>

            {loading ? (

                <div className="w-full h-52 flex items-center justify-center border-[3px] border-slate-900 rounded-2xl">
                    <div className="w-10 h-10 border-4 border-slate-300 border-t-purple-500 rounded-full animate-spin"></div>
                </div>

            ) : data.length === 0 ? (

                <div className="w-full h-52 mt-5 flex items-center justify-center border-[3px] border-slate-900 rounded-2xl">
                    <div className="w-full h-48 flex flex-col items-center justify-center">
                        <span className="text-4xl mb-3">😿</span>
                        <span className="text-slate-500 font-semibold">Tidak ada transaksi</span>
                    </div>
                </div>

            ) : (

                data.slice(0, 4).map((item: historyData, key: number) => {

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
                                    className={`w-12 h-12 ${item.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'} border-2 border-slate-900 rounded-xl flex items-center justify-center text-xl shrink-0`}
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