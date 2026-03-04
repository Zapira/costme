'use client';
import { useState } from "react";
import Modal from "../ui/modal";
import Title from "../ui/title";

export default function Content() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActiveWallet, setIsActiveWallet] = useState<number | null>(null);
    const walletIcons = ['💳', '💵', '🏦', '📱', '💰', '🪙', '💎', '🎫'];
    
    const handleWalletClick = (index: number) => {
        console.log(`Wallet ${index} clicked`);
        setIsActiveWallet(index);
    }

    // const walletColors = [
    //     { name: 'Violet', value: 'bg-violet-400' },
    //     { name: 'Rose', value: 'bg-rose-400' },
    //     { name: 'Cyan', value: 'bg-cyan-400' },
    //     { name: 'Amber', value: 'bg-amber-400' },
    //     { name: 'Emerald', value: 'bg-emerald-400' },
    //     { name: 'Pink', value: 'bg-pink-400' },
    //     { name: 'Indigo', value: 'bg-indigo-400' },
    //     { name: 'Orange', value: 'bg-orange-400' }
    // ];

    return (
        <>
            <div>
                <Title onClick={() => setIsModalOpen(true)}>Dompet saya</Title>
            </div>
            <Modal titleModal="Fitur Belum Tersedia" isOpen={isModalOpen} setIsOpen={setIsModalOpen} >
                <form action="">
                    <div className="mb-4">
                        <label htmlFor="">Nama Dompet</label>
                        <input type="text" className="w-full border rounded-md p-2 mt-1" placeholder="Masukkan nama dompet" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">Saldo</label>
                        <input type="text" className="w-full border rounded-md p-2 mt-1" placeholder="Masukkan saldo" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">Pilih Icon</label>
                        <div className="grid grid-cols-4 gap-2 mt-1">
                            {walletIcons.map((icon, index) => (
                            <button key={index} type="button" className={`cursor-pointer text-2xl p-2 border rounded-md hover:bg-purple-400 transition-colors ${isActiveWallet === index ? 'bg-purple-400' : ''}`} onClick={() => handleWalletClick(index)}>
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>
        </>

    )
}