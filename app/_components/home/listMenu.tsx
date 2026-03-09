'use client'
import TransferFeature from "@/app/_features/TransferFeature";
import { UserType } from "@/app/_types/authSliceType";
import { useState } from "react";

export default function ListMenu({ user }: { user: UserType }) {
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const handleOpenTransferModal = () => {
        setIsTransferModalOpen(true);
    }

    const handleCloseTransferModal = () => {
        setIsTransferModalOpen(false);
    }
    return (
        <>
            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[3px_3px_0_0_rgb(15,23,42)] mt-5">
                <div className="grid grid-cols-4 gap-3 ">
                    <button onClick={handleOpenTransferModal} className="flex flex-col items-center gap-1 p-2 rounded-xl active:translate-x-[1px] active:translate-y-[1px] transition-all">
                        <div className="w-9 h-9 bg-rose-100 border-2 border-slate-900 rounded-lg flex items-center justify-center text-lg">
                            💸
                        </div>
                        <span className="text-[11px] font-semibold text-slate-900">
                            Transfer
                        </span>
                    </button>

                    <button className="flex flex-col items-center gap-1 p-2 rounded-xl active:translate-x-[1px] active:translate-y-[1px] transition-all">
                        <div className="w-9 h-9 bg-emerald-100 border-2 border-slate-900 rounded-lg flex items-center justify-center text-lg">
                            📥
                        </div>
                        <span className="text-[11px] font-semibold text-slate-900">
                            Pemasukan
                        </span>
                    </button>

                    <button className="flex flex-col items-center gap-1 p-2 rounded-xl active:translate-x-[1px] active:translate-y-[1px] transition-all">
                        <div className="w-9 h-9 bg-amber-100 border-2 border-slate-900 rounded-lg flex items-center justify-center text-lg">
                            💸
                        </div>
                        <span className="text-[11px] font-semibold text-slate-900">
                            Pengeluaran
                        </span>
                    </button>
                    <button className="flex flex-col items-center gap-1 p-2 rounded-xl active:translate-x-[1px] active:translate-y-[1px] transition-all">
                        <div className="w-9 h-9 bg-amber-100 border-2 border-slate-900 rounded-lg flex items-center justify-center text-lg">
                            💸
                        </div>
                        <span className="text-[11px] font-semibold text-slate-900">
                            Budgetin Bulanan
                        </span>
                    </button>
                </div>
            </div>
            <TransferFeature user={user} isTransferModalOpen={isTransferModalOpen} setIsTransferModalOpen={setIsTransferModalOpen} />
        </>

    )
}