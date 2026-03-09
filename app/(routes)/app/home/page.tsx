import AccountCard from "@/app/_components/home/accountCard";
import LastTransaction from "@/app/_components/home/lastTransaction";
import ListMenu from "@/app/_components/home/listMenu";
import RemainingCard from "@/app/_components/home/remainingCard";
import BottomBar from "@/app/_components/shared/bottomBar";
import Navbar from "@/app/_components/shared/navbar";
import { getUser } from "@/app/_services/userService";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function Home() {
    await sleep(2000); 

    const user = await getUser();

    return (
        <div className="bg-gray-50 p-6 shadow-md max-w-lg mx-auto min-h-screen ">
            <Navbar user={user} />
            <BottomBar />
            <AccountCard />
            <RemainingCard />
            <ListMenu user={user} />
            <LastTransaction />
        </div>
    );
}