import AccountCard from "@/app/_components/home/accountCard";
import LastTransaction from "@/app/_components/home/lastTransaction";
import RemainingCard from "@/app/_components/home/remainingCard";
import BottomBar from "@/app/_components/shared/bottomBar";
import Navbar from "@/app/_components/shared/navbar";
import { getUser } from "@/app/_services/userService";

export default async function Home() {
    const user = await getUser();
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