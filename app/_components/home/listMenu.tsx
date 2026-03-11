'use client'
import ExpenseFeature from "@/app/_features/ExpenseFeature";
import IncomeFeature from "@/app/_features/IncomeFeature";
import TransferFeature from "@/app/_features/TransferFeature";
import { UserType } from "@/app/_types/authSliceType";
import Link from "next/link";
import { useState } from "react";

export default function ListMenu({ user }: { user: UserType }) {
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

    const handleOpenTransferModal = () => {
        setIsTransferModalOpen(true);
    }

    const handleOpenIncomeModal = () => {
        setIsIncomeModalOpen(true);
    }

    const handleOpenExpenseModal = () => {
        setIsExpenseModalOpen(true);
    }


    return (
        <>
            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[6px_6px_0_0_rgb(15,23,42)] mt-5 mr-2">
                <div className="grid grid-cols-4 gap-3 ">
                    <button onClick={handleOpenTransferModal} className="flex flex-col items-center gap-1 p-2 rounded-xl active:translate-x-0.5 active:translate-y-0.5 transition-all">
                        <div className="w-9 h-9 bg-rose-100 border-2 border-slate-900 rounded-lg flex items-center justify-center text-lg">
                            💸
                        </div>
                        <span className="text-[11px] font-semibold text-slate-900">
                            Transfer
                        </span>
                    </button>

                    <button onClick={handleOpenIncomeModal} className="flex flex-col items-center gap-1 p-2 rounded-xl active:translate-x-0.5 active:translate-y-0.5 transition-all">
                        <div className="w-9 h-9 bg-emerald-100 border-2 border-slate-900 rounded-lg flex items-center justify-center text-lg">
                            📥
                        </div>
                        <span className="text-[11px] font-semibold text-slate-900">
                            Pemasukan
                        </span>
                    </button>

                    <button onClick={handleOpenExpenseModal} className="flex flex-col items-center gap-1 p-2 rounded-xl active:translate-x-0.5 active:translate-y-0.5 transition-all">
                        <div className="w-9 h-9 bg-amber-100 border-2 border-slate-900 rounded-lg flex items-center justify-center text-lg">
                            💸
                        </div>
                        <span className="text-[11px] font-semibold text-slate-900">
                            Pengeluaran
                        </span>
                    </button>
                    <Link href="/app/monthly-budget" className="flex flex-col items-center gap-1 p-2 rounded-xl active:translate-x-0.5 active:translate-y-0.5 transition-all">
                        <div className="w-9 h-9 bg-amber-100 border-2 border-slate-900 rounded-lg flex items-center justify-center text-lg">
                            💸
                        </div>
                        <span className="text-[11px] font-semibold text-slate-900">
                            Budgetin Bulanan
                        </span>
                    </Link>
                </div>
            </div>
            <TransferFeature user={user} isTransferModalOpen={isTransferModalOpen} setIsTransferModalOpen={setIsTransferModalOpen} />
            <IncomeFeature user={user} isIncomeModalOpen={isIncomeModalOpen} setIsIncomeModalOpen={setIsIncomeModalOpen} />
            <ExpenseFeature user={user} isExpenseModalOpen={isExpenseModalOpen} setIsExpenseModalOpen={setIsExpenseModalOpen} />
        </>

    )
}