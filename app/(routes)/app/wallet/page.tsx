import Content from "@/app/_components/wallet/content";
import BottomBar from "@/app/_components/shared/bottomBar";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function Wallet() {
    await sleep(2000);
    return (
        <div className="bg-gray-50 p-6 shadow-md max-w-lg mx-auto min-h-screen ">
            <Content />
            <BottomBar />

        </div>
    );
}