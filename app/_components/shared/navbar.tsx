import Link from "next/link";
import { FaUser } from "react-icons/fa";

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center ">
            <div className="flex flex-col gap-1 font-bold">
                <h2 className="text-2xl">Hallo, Muhammad Rizki</h2>
                <span className="text-xs opacity-80">Kelola keuangan anda dengan bijak</span>
            </div>
            <div className="flex items-center gap-4">
                {/* <Link href="/login" className="text-xl font-bold">
                    Login
                </Link> */}
                <FaUser size={40} className="font-bold" />
            </div>
        </nav>
    );
}