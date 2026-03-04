import { useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";

type ModalProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
    titleModal?: string;
};

export default function Modal({ isOpen, setIsOpen, children, titleModal }: ModalProps) {
    const [render, setRender] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setRender(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setVisible(true);
                });
            });
        } else {
            setVisible(false);

            setTimeout(() => {
                setRender(false);
            }, 300);
        }
    }, [isOpen]);

    if (!render) return null;

    return (
        <div
            onClick={() => setIsOpen(false)}
            className={`
            fixed inset-0 z-50
            flex justify-center items-start
            overflow-y-auto
            p-6
            transition-opacity duration-300 ease-out
            ${visible ? "opacity-100 bg-black/40 backdrop-blur-sm" : "opacity-0"}
        `}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
                bg-white w-full max-w-md rounded-xl shadow-xl
                transform transition-all duration-300 ease-out
                ${visible
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-4 scale-95"}
            `}
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-xl font-bold">{titleModal}</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FaX size={18} />
                    </button>
                </div>

                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}