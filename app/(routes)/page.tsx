import Navbar from "../_components/shared/navbar";
import BottomBar from "../_components/shared/bottomBar";
import AccountCard from "../_components/home/accountCard";
import RemainingCard from "../_components/home/remainingCard";
import LastTransaction from "../_components/home/lastTransaction";

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
