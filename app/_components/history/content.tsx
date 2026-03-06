'use client';

import { useState } from "react";
import Title from "../ui/title";
import { FaCalendar } from "react-icons/fa";
import { get, ref } from "firebase/database";
import { db } from "@/app/_lib/firebaseDb";
import { historyData } from "@/app/_types/walletType";

export default function Content() {
    const [filter, setFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [historyData, setHistoryData] = useState<historyData[]>([]);

    const fetchHistoryData = async (uid: string) => {
        const [incomeSnapshot, expenseSnapshot] = await Promise.all([
            get(ref(db, `users/${uid}/history-income`)),
            get(ref(db, `users/${uid}/history-expense`))
        ]);

        const incomeData = incomeSnapshot.val();
        const expenseData = expenseSnapshot.val();

        if (!incomeSnapshot.exists() && !expenseSnapshot.exists()) {
            return [];
        }

        const historyData = { ...incomeData, ...expenseData };

        const sortedHistoryData = (Object.values(historyData) as historyData[]).sort(
            (a: historyData, b: historyData) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setHistoryData(sortedHistoryData);

    }

    const filteredData = historyData.filter(item => {
        const matchesType = filter === 'all' || item.type === filter;
        let matchesDate = true;
        if (startDate && endDate) {
            const itemDate = new Date(item.timestamp);
            const start = new Date(startDate);
            const end = new Date(endDate);
            matchesDate = itemDate >= start && itemDate <= end;
        }

        return matchesType && matchesDate;
    });

    const totalIncome = filteredData
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);

    const totalExpense = filteredData
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const resetDateFilter = () => {
        setStartDate('');
        setEndDate('');
    };

    return (
        <div className="pb-24">
            <div>
                <Title>History</Title>
            </div>

            <div className="px-5 pb-3 mt-4">
                <div className="bg-white p-1.5 rounded-2xl border-[3px] border-slate-900 shadow-[4px_4px_0_0_rgb(15,23,42)] flex gap-2">
                    {[
                        { value: 'all', label: 'Semua' },
                        { value: 'income', label: 'Pemasukan' },
                        { value: 'expense', label: 'Pengeluaran' }
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setFilter(tab.value)}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${filter === tab.value
                                    ? 'bg-violet-500 text-white border-[2px] border-slate-900 shadow-[2px_2px_0_0_rgb(15,23,42)]'
                                    : 'text-slate-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-5 pb-4">
                <button
                    onClick={() => setShowDateFilter(!showDateFilter)}
                    className="w-full px-4 py-3 bg-white border-[3px] border-slate-900 rounded-xl text-sm font-bold text-slate-900 shadow-[4px_4px_0_0_rgb(15,23,42)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgb(15,23,42)] transition-all flex items-center justify-center gap-2"
                >
                    <FaCalendar size={18} strokeWidth={3} />
                    <span>Filter Tanggal</span>
                    {(startDate && endDate) && (
                        <span className="ml-2 px-2 py-0.5 bg-violet-100 rounded-lg text-xs">
                            Aktif
                        </span>
                    )}
                </button>
            </div>

            {/* Date Filter Panel */}
            {showDateFilter && (
                <div className="px-5 pb-5">
                    <div className="bg-white border-[3px] border-slate-900 rounded-2xl p-5 shadow-[6px_6px_0_0_rgb(15,23,42)]">
                        <h4 className="text-sm font-black text-slate-900 mb-4">Pilih Rentang Tanggal</h4>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">Dari Tanggal</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-3 border-[3px] border-slate-900 rounded-xl font-semibold text-slate-900 shadow-[4px_4px_0_0_rgb(15,23,42)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_rgb(15,23,42)] transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">Sampai Tanggal</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-3 border-[3px] border-slate-900 rounded-xl font-semibold text-slate-900 shadow-[4px_4px_0_0_rgb(15,23,42)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_rgb(15,23,42)] transition-all outline-none"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={resetDateFilter}
                                    className="flex-1 px-4 py-3 bg-slate-100 border-[3px] border-slate-900 rounded-xl text-sm font-bold text-slate-900 shadow-[4px_4px_0_0_rgb(15,23,42)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgb(15,23,42)] transition-all"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => setShowDateFilter(false)}
                                    className="flex-1 px-4 py-3 bg-violet-500 border-[3px] border-slate-900 rounded-xl text-sm font-bold text-white shadow-[4px_4px_0_0_rgb(15,23,42)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgb(15,23,42)] transition-all"
                                >
                                    Terapkan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(startDate && endDate) && (
                <div className="px-5 pb-4">
                    <div className="bg-violet-100 border-[3px] border-slate-900 rounded-xl p-3 shadow-[4px_4px_0_0_rgb(15,23,42)] flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                            📅 {formatDate(startDate)} - {formatDate(endDate)}
                        </span>
                        <button
                            onClick={resetDateFilter}
                            className="text-xs font-bold text-violet-600 underline"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="px-5 pb-6 grid grid-cols-2 gap-3">
                <div className="bg-emerald-100 border-[3px] border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0_0_rgb(15,23,42)] flex items-center gap-3">
                    <span className="text-2xl">📈</span>
                    <div>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Total Pemasukan</p>
                        <p className="text-sm font-black text-slate-900">{formatCurrency(totalIncome)}</p>
                    </div>
                </div>
                <div className="bg-rose-100 border-[3px] border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0_0_rgb(15,23,42)] flex items-center gap-3">
                    <span className="text-2xl">💸</span>
                    <div>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Total Pengeluaran</p>
                        <p className="text-sm font-black text-slate-900">{formatCurrency(totalExpense)}</p>
                    </div>
                </div>
            </div>

            {/* History List */}
            <div className="px-5 pb-6">
                <h3 className="text-lg font-black text-slate-900 mb-4">
                    {filter === 'all' ? 'Semua Transaksi' : filter === 'income' ? 'Pemasukan' : 'Pengeluaran'} ({filteredData.length})
                </h3>

                {filteredData.length === 0 ? (
                    <div className="w-full h-48 flex flex-col items-center justify-center">
                        <span className="text-4xl mb-3">📭</span>
                        <span className="text-slate-500 font-semibold">Tidak ada transaksi</span>
                        <span className="text-xs text-slate-400 font-semibold mt-1">Coba ubah filter atau rentang tanggal</span>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredData.map((item, index) => (
                            <div
                                key={item.id}
                                className="bg-white border-[3px] border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0_0_rgb(15,23,42)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgb(15,23,42)] transition-all"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div
                                        className={`w-12 h-12 ${item.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'} border-[2px] border-slate-900 rounded-xl flex items-center justify-center text-xl flex-shrink-0`}
                                    >
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900">{item.title}</p>
                                        <p className="text-xs text-slate-500 font-semibold mt-1">
                                            {item.wallet} • {formatDate(item.date)}
                                        </p>
                                        <span className="inline-block mt-1.5 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-3 border-t-2 border-slate-100">
                                    <span className={`text-base font-black ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}