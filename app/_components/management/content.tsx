'use client';
import { useEffect, useState } from "react";
import Modal from "../ui/modal";
import Title from "../ui/title";
import { useForm } from "react-hook-form";
import { push, ref } from "firebase/database";
import { db } from "@/app/_lib/firebaseDb";
import { auth } from "@/app/_lib/firebaseAuth";
import Swal from "sweetalert2";
import { WalletType } from "@/app/_types/walletType";


export default function Content() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActiveWallet, setIsActiveWallet] = useState<number | null>(null);
    const walletIcons = ['💳', '💵', '🏦', '📱', '💰', '🪙', '💎', '🎫'];
    const { register, handleSubmit, formState: { errors }, reset } = useForm<WalletType>({
        defaultValues: {
            name: '',
            balance: 0,
        }
    });

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

    const onSubmit = async (data: WalletType) => {
        console.log(data);
        const authcheck = auth.currentUser;
        console.log(authcheck?.uid);
        try {
            const walletData = {
                name: data.name,
                balance: data.balance,
                icon: isActiveWallet
            }

            if (isActiveWallet === null) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Pilih Icon Dompet',
                    text: 'Silakan pilih icon untuk dompet Anda',
                });
                return;
            }

            const walletsRef = ref(db, `users/${authcheck?.uid}/wallets`);
            const response = await push(walletsRef, walletData);
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Dompet Berhasil Ditambahkan',
                    text: 'Dompet Anda telah berhasil ditambahkan',
                }).then(() => {
                    setIsModalOpen(false);
                    setIsActiveWallet(null);
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onError = () => {
        console.log(errors);
        Swal.fire({
            icon: 'warning',
            title: 'Terjadi Kesalahan',
            text: 'Periksa kembali semua field yang wajib diisi dan pastikan memilih icon dompet',
        });
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setIsActiveWallet(null);
        reset({
            name: '',
            balance: 0,
        })
    }


    return (
        <>
            <div>
                <Title onClick={() => setIsModalOpen(true)}>Dompet saya</Title>
            </div>
            <Modal titleModal="Fitur Belum Tersedia" isOpen={isModalOpen} setIsOpen={closeModal} >
                <form onSubmit={handleSubmit(onSubmit, onError)} className="p-4">
                    <div className="mb-4">
                        <label htmlFor="">Nama Dompet</label>
                        <input type="text" {...register("name", { required: true })} className={`w-full border rounded-md p-2 mt-1 ${errors.name ? 'border-red-500' : 'border-purple-500'}`} placeholder="Masukkan nama dompet" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">Saldo</label>
                        <input type="text" {...register("balance", { required: true })} className={`w-full border rounded-md p-2 mt-1 ${errors.balance ? 'border-red-500' : 'border-purple-500'}`} placeholder="Masukkan saldo" />
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
                    <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition-colors">Simpan</button>
                </form>
            </Modal>
        </>

    )
}