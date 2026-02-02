"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiTrendingUp } from "react-icons/bi";
import { CgMonday } from "react-icons/cg";
import { IoMdExit } from "react-icons/io";
import { HiHome } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { auth } from "@/app/_lib/firebaseAuth";
import { signOut } from "firebase/auth";
import { db } from "@/app/_lib/firebaseDb";
import { ref, set } from "firebase/database";

export default function BottomBar() {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (path: string) => {
        return pathname === path;
    }

    const handleLogout = async () => {
        if (confirm('are you sure to logout?')) {
            const user = auth.currentUser;
            console.log('user', user)
            if (user) {
                const userRef = ref(db, "users/" + user.uid);
                await set(userRef, { isLoggedIn: false });
            }

            await signOut(auth);
            console.log("currentUser:", auth.currentUser);

            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            router.push("/auth/login");
        }
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

                    <button onClick={handleLogout} className={isActive("/settings") ? "flex flex-col items-center py-2 bg-gray-200" : "flex flex-col items-center py-2 hover:bg-gray-200"}>
                        <IoMdExit size={24} />
                        <span className="font-bold text-[10px]">Logout</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
