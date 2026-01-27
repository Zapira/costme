import Link from "next/link";
import { FaUser } from "react-icons/fa";

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center ">
            <div className="flex items-center gap-4 font-bold w-50">
                <h2 className="text-2xl">Welcome Back, Muhammad Rizki</h2>
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