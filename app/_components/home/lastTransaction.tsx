'use client';
import { auth } from "@/app/_lib/firebaseAuth";
import { db } from "@/app/_lib/firebaseDb";
import { historyData } from "@/app/_types/walletType";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref, set } from "firebase/database";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LastTransaction() {
    const [data, setData] = useState<historyData[]>([]);
    const [loading, setLoading] = useState(true);

    const getDataHistory = async (uid: string) => {
        try {
            setLoading(true);
            const historyRef = ref(db, `users/${uid}/history`);
            const snapshot = await get(historyRef);

            console.log("Snapshot data:", snapshot.val());
            if (!snapshot.exists()) return;

            const historyData = snapshot.val();

            const filteredData: historyData[] = (Object.values(historyData) as historyData[])
                .filter((item: historyData) =>
                    item.type === "income" || item.type === "expense"
                );

            const sortedData = filteredData.sort(
                (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            const walletNamesRef = ref(db, `users/${uid}/wallets`);
            const walletNamesSnapshot = await get(walletNamesRef);
            const walletNamesData = walletNamesSnapshot.val();

            const enrichedData = sortedData.map((item) => {

                if (item.type === "income" || item.type === "expense") {
                    const walletName = walletNamesData?.[item.walletId]?.name || "Unknown Wallet";
                    return { ...item, walletName };
                }

                return item;
            });
            console.log("Enriched data:", enrichedData);

            setData(enrichedData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching history data:", error);
            setLoading(false);
        }
    };


    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await getDataHistory(user.uid);
            } else {
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
                <Link href="/transactions" className="text-sm font-bold text-purple-700">Lihat Semua</Link>
            </div>
            {loading ? (
                <div className="w-full h-[120px] flex items-center justify-center border-[3px] border-slate-900 rounded-2xl">
                    <div className="w-10 h-10 border-4 border-slate-300 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
            ) : data.length === 0 ? (
                <div className="w-full h-[120px] flex items-center justify-center border-[3px] border-slate-900 rounded-2xl">
                    <span className="text-gray-500">Belum ada transaksi</span>
                </div>
            ) : (
                data.slice(0, 5).map((item: historyData, key: number) => {
                    return (
                        <div key={key}>
                            <div className="mt-4">
                                <div className="border border-gray-300 rounded-2xl p-4 flex items-center space-x-4">
                                    <div className={`rounded-xl  p-3 ${item.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                                        <span className="text-2xl">{item.type === 'income' ? '📈' : '💸'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-lg font-bold">{expenseCategories.find(cat => cat.id === parseInt(item.expenseCategoryId))?.name || "Unknown Category"}</h2>
                                        <span className="text-[12px] opacity-40 font-bold">{item.walletName} {item.timestamp}</span>
                                    </div>
                                    <div className="flex flex-col ml-auto">
                                        <h2 className={`text-lg font-bold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{item.type === 'income' ? `+ Rp. ${new Intl.NumberFormat('id-ID').format(item.amount)}` : `- Rp. ${new Intl.NumberFormat('id-ID').format(item.amount)}`}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )

                })
            )}


        </div>
    );
}