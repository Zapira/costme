"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiTrendingUp } from "react-icons/bi";
import { CgMonday } from "react-icons/cg";
import { GrSettingsOption } from "react-icons/gr";
import { HiHome } from "react-icons/hi2";

export default function BottomBar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    }
    return (    
        <div className=" max-w-lg mx-auto fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-white border-t border-gray-300 z-10">
            <nav>
                <div className="grid grid-cols-4 text-black">
                    <Link href="/" className={isActive("/") ? "flex flex-col items-center py-2 bg-gray-200" : "flex flex-col items-center py-2 hover:bg-gray-200"}>
                        <HiHome size={24} />
                        <span className="font-bold text-[10px]">Beranda</span>
                    </Link>

                    <Link href="/transactions" className={isActive("/transactions") ? "flex flex-col items-center py-2 bg-gray-200" : "flex flex-col items-center py-2 hover:bg-gray-200"}>
                        <BiTrendingUp size={24} />
                        <span className="font-bold text-[10px]">Transaksi</span>
                    </Link>

                    <Link href="/management" className={isActive("/management") ? "flex flex-col items-center py-2 bg-gray-200" : "flex flex-col items-center py-2 hover:bg-gray-200"}>
                        <CgMonday size={24} />
                        <span className="font-bold text-[10px]">Manajemen</span>
                    </Link>

                    <Link href="/settings" className={isActive("/settings") ? "flex flex-col items-center py-2 bg-gray-200" : "flex flex-col items-center py-2 hover:bg-gray-200"}>
                        <GrSettingsOption size={24} />
                        <span className="font-bold text-[10px]">Pengaturan</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
