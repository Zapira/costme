import Navbar from "../_components/shared/navbar";
import BottomBar from "../_components/shared/bottomBar";
import AccountCard from "../_components/home/accountCard";
import RemainingCard from "../_components/home/remainingCard";

export default function Home() {
  return (
    <div className="bg-white p-6 shadow-md max-w-lg mx-auto min-h-[calc(100vh-56px)] relative">
      <Navbar />
      <BottomBar />
      <AccountCard />
      <RemainingCard />
    </div>
  );
}
