import { useEffect, useState } from "react";

type ModalProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
};

export default function Modal({ isOpen, setIsOpen, children }: ModalProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setShow(true), 0);
        } else {
            setTimeout(() => setShow(false), 200);
        }
    }, [isOpen]);

    if (!show) return null;

    return (
        <div
            onClick={() => setIsOpen(false)}
            className={`fixed inset-0 z-50 flex justify-center pt-24 transition-all duration-200 ${isOpen ? "bg-black/30 backdrop-blur-sm opacity-100" : "opacity-0"
                }`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white w-full max-w-md rounded-xl shadow-xl p-6 transform transition-all duration-200 ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
                    }`}
            >
                {children}
            </div>
        </div>
    );
}