import AccountCard from "@/app/_components/home/accountCard";
import LastTransaction from "@/app/_components/home/lastTransaction";
import RemainingCard from "@/app/_components/home/remainingCard";
import BottomBar from "@/app/_components/shared/bottomBar";
import Navbar from "@/app/_components/shared/navbar";
import { getUser } from "@/app/_services/userService";
import { redirect } from "next/navigation";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function Home() {
    await sleep(2000);

    const user = await getUser();

    // 🚨 jika tidak login redirect ke login
    if (!user) {
        redirect("/login");
    }

    return (
        <div className="bg-gray-50 p-6 shadow-md max-w-lg mx-auto min-h-screen ">
            <Navbar user={user} />
            <BottomBar />
            <AccountCard />
            <RemainingCard />
            <LastTransaction />
        </div>
    );
}