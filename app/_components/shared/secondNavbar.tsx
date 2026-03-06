'use client';

import Link from "next/link";
import { useState } from "react";
import { FaHamburger } from "react-icons/fa";
import { FaUser, FaX } from "react-icons/fa6";

export default function SecondNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="flex justify-between items-center p-5 bg-white border-slate-900 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-purple-600 border-[3px] border-slate-900 rounded-xl flex items-center justify-center text-white font-black shadow-[4px_4px_0_0_rgb(15,23,42)]">
                        C
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">COSTME</h2>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-12 h-12 bg-white border-[3px] border-slate-900 rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_rgb(15,23,42)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgb(15,23,42)] transition-all"
                >
                    {isOpen ? (
                        <FaX size={24} strokeWidth={3} className="text-slate-900" />
                    ) : (
                        <FaHamburger size={24} strokeWidth={3} className="text-slate-900" />
                    )}
                </button>
            </nav>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out bg-white border-b-[3px] border-slate-900 ${isOpen ? "max-h-48" : "max-h-0"
                    }`}
            >
                <nav className="p-5">
                    <ul className="flex flex-col gap-3">
                        <li>
                            <Link href="/login">
                                <button className="w-full px-5 py-3 bg-white border-[3px] border-slate-900 rounded-xl text-sm font-bold text-slate-900 shadow-[4px_4px_0_0_rgb(15,23,42)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgb(15,23,42)] transition-all flex items-center justify-center gap-2">
                                    <FaUser size={18} strokeWidth={3} />
                                    <span>Masuk</span>
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/register">
                                <button className="w-full px-5 py-3 bg-gradient-to-br from-violet-500 to-purple-600 border-[3px] border-slate-900 rounded-xl text-sm font-bold text-white shadow-[4px_4px_0_0_rgb(15,23,42)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgb(15,23,42)] transition-all">
                                    Daftar Gratis
                                </button>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}