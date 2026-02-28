import { FaPlus } from "react-icons/fa";

type TitleProps = {
    children: React.ReactNode;
    onClick?: () => void;
};

export default function Title({ children, onClick }: TitleProps) {
    return (
        <div className="flex flex-col gap-1 font-bold">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {children}
            </h1>

            {onClick && (
                <button
                    onClick={onClick}
                    className="text-sm text-blue-500 hover:underline"
                >
                    <FaPlus className="inline mr-1" />
                    Tambah
                </button>
            )}
        </div>
    );
}