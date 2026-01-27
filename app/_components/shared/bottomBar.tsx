import Link from "next/link";
import { BiTrendingUp } from "react-icons/bi";
import { CgMonday } from "react-icons/cg";
import { GrSettingsOption } from "react-icons/gr";
import { HiHome } from "react-icons/hi2";

export default function BottomBar() {
    return (
        <div className="absolute bottom-0 left-0 w-full p-4">
            <nav className="border bg-[#211515] rounded-2xl border-gray-300">
                <div className="grid grid-cols-4 text-white">
                    <Link
                        href="/"
                        className="flex flex-col items-center justify-center py-2 hover:bg-[#170e0e] rounded-xl transition"
                    >
                        <HiHome size={24} />
                        <span className="font-bold text-[10px]">Beranda</span>
                    </Link>

                    <Link
                        href="/transactions"
                        className="flex flex-col items-center justify-center py-2 hover:bg-[#170e0e] rounded-xl transition"
                    >
                        <BiTrendingUp size={24} />
                        <span className="font-bold text-[10px]">Transaksi</span>
                    </Link>

                    <Link
                        href="/management"
                        className="flex flex-col items-center justify-center py-2 hover:bg-[#170e0e] rounded-xl transition"
                    >
                        <CgMonday size={24} />
                        <span className="font-bold text-[10px]">Manajemen</span>
                    </Link>

                    <Link
                        href="/settings"
                        className="flex flex-col items-center justify-center py-2 hover:bg-[#170e0e] rounded-xl transition"
                    >
                        <GrSettingsOption size={24} />
                        <span className="font-bold text-[10px]">Pengaturan</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
