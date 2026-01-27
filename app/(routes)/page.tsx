import Navbar from "../_components/shared/navbar";
import BottomBar from "../_components/shared/bottomBar";
import AccountCard from "../_components/home/accountCard";

export default function Home() {
  return (
    <div className="bg-white p-6 shadow-md max-w-lg mx-auto min-h-screen relative">
      <Navbar />
      <BottomBar />
      <AccountCard />
    </div>
  );
}
