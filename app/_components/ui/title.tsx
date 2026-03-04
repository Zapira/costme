import { FaPlus } from "react-icons/fa";

type TitleProps = {
    children: React.ReactNode;
    onClick?: () => void;
};

export default function Title({ children, onClick }: TitleProps) {
    return (
        <div className="flex justify-between items-center gap-1 font-bold">
            <h1 className="text-3xl font-bold text-gray-800">
                {children}
            </h1>

            {onClick && (
                <button
                    onClick={onClick}
                    className="p-3 bg-white border-[3px] border-slate-900 rounded-2xl text-base font-bold text-slate-900 shadow-[6px_6px_0_0_rgb(139,92,246)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[3px_3px_0_0_rgb(139,92,246)] transition-all flex items-center justify-center gap-2"
                >
                    <FaPlus className="inline mr-1" />
                    Tambah
                </button>
            )}
        </div>
    );
}