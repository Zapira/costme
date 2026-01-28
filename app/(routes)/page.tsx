import Hero from "../_components/home/homeSecond/hero";
import SecondNavbar from "../_components/shared/secondNavbar";

export default function Home() {

  return (
    <div className="bg-gray-50 shadow-md max-w-lg mx-auto min-h-screen ">
      <div className="bg-white">
        <SecondNavbar />
      </div>
      <Hero />
    </div>
  );
}
