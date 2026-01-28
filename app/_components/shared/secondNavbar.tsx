'use client';

import Link from "next/link";
import { useState } from "react";
import { FaHamburger, FaUser } from "react-icons/fa";

export default function SecondNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="flex justify-between items-center p-4">
                <div className="flex flex-col gap-1 font-bold">
                    <h2 className="text-2xl text-purple-800 font-bold">COSTME</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <FaHamburger size={25} className="font-bold" />
                    </button>
                </div>
            </nav>

            <div
                className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-40 bg-white" : "max-h-0"
                    }`}
            >
                <nav className="flex flex-col gap-4 p-4">
                    <ul className="flex flex-col gap-2 items-center">
                        <li className="cursor-pointer font-bold">Masuk</li>
                        <li className="w-full px-5 py-2.5 bg-linear-to-r from-purple-500 to-purple-800  rounded-xl text-sm font-bold text-white text-center cursor-pointer">
                            Daftar Gratis
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}
