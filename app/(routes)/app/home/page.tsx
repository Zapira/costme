import AccountCard from "@/app/_components/home/accountCard";
import LastTransaction from "@/app/_components/home/lastTransaction";
import RemainingCard from "@/app/_components/home/remainingCard";
import BottomBar from "@/app/_components/shared/bottomBar";
import Navbar from "@/app/_components/shared/navbar";

export default function Home() {
    return (
        <div className="bg-gray-50 p-6 shadow-md max-w-lg mx-auto min-h-screen ">
            <Navbar />
            <BottomBar />
            <AccountCard />
            <RemainingCard />
            <LastTransaction />
        </div>
    );
}