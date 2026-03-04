'use client';
import { useEffect, useState } from "react";
import Modal from "../ui/modal";
import Title from "../ui/title";
import { useForm } from "react-hook-form";
import { get, onValue, push, ref, set } from "firebase/database";
import { db } from "@/app/_lib/firebaseDb";
import { auth } from "@/app/_lib/firebaseAuth";
import Swal from "sweetalert2";
import { WalletType } from "@/app/_types/walletType";
import { onAuthStateChanged } from "firebase/auth";
import { UserType } from "@/app/_types/authSliceType";
import { FaTrash } from "react-icons/fa";


export default function Content() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActiveWallet, setIsActiveWallet] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<UserType>();
    const [wallets, setWallets] = useState<WalletType[]>([]);
    const [isDelete, setIsDelete] = useState(false);
    const [totalBalance, setTotalBalance] = useState(0);
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

    const handleOnlyNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, '');
        const addCommaValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        e.target.value = addCommaValue;
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
        try {
            const removeCommaBalance = Number(data.balance.toString().replace(/,/g, ''));
            const walletData = {
                name: data.name,
                balance: removeCommaBalance,
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

            const walletsRef = ref(db, `users/${user?.uid}/wallets`);
            const response = await push(walletsRef, walletData);
            const totalBalance = ref(db, `users/${user?.uid}/totalBalance`);
            const totalBalanceSnapshot = await get(totalBalance);
            const currentTotalBalance = totalBalanceSnapshot.exists() ? totalBalanceSnapshot.val() : 0;
            await set(totalBalance, currentTotalBalance + removeCommaBalance);
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

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setUser(user as UserType);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    useEffect(() => {
        if (!user) return;

        const walletsRef = ref(db, `users/${user.uid}/wallets`);
        const totalBalanceRef = ref(db, `users/${user.uid}/totalBalance`);
        const unsubscribe = onValue(walletsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const walletsArray = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setWallets(walletsArray);
            } else {
                setWallets([]);
            }
        });

        const unsubscribeTotalBalance = onValue(totalBalanceRef, (snapshot) => {
            if (snapshot.exists()) {
                setTotalBalance(snapshot.val());
            } else {
                setTotalBalance(0);
            }
        });

        return () => {
            unsubscribe();
            unsubscribeTotalBalance();
        };
    }, [user]);

    const handleDeleteWallet = async (walletId: string) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Dompet yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await set(ref(db, `users/${user?.uid}/wallets/${walletId}`), null);
                    Swal.fire(
                        'Terhapus!',
                        'Dompet Anda telah dihapus.',
                        'success'
                    );
                } catch (error) {
                    console.log(error);
                    Swal.fire(
                        'Gagal!',
                        'Terjadi kesalahan saat menghapus dompet.',
                        'error'
                    );
                }
            }
        });
    }

    return (
        <>
            <div>
                <Title onClick={() => setIsModalOpen(true)}>Dompet saya</Title>
            </div>
            <div className="mt-4">
                <div className="border-black border-2 flex flex-col items-center mb-2 bg-linear-to-r from-purple-500 to-pink-500 p-4 rounded-md text-white">
                    <span className="font-bold text-sm">TOTAL DI SEMUA DOMPET</span>
                    <span className="text-2xl font-extrabold">Rp {totalBalance.toLocaleString('id-ID')}</span>
                </div>
            </div>
            <div className="mt-5">
                <div className="flex items-center gap-3">
                    <h2 className="font-bold text-lg whitespace-nowrap">
                        Dompet Aktif
                    </h2>
                    <div className="flex-1 border-b-2 border-purple-500"></div>
                </div>
                {loading ? (
                    <div className="w-full h-48 flex items-center justify-center">
                        <span className="text-gray-500">Loading...</span>
                    </div>
                ) : (
                    wallets.length === 0 ? (
                        <div className="w-full h-48 flex items-center justify-center">
                            <span className="text-gray-500">Belum ada dompet aktif</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 mt-3 max-h-96 overflow-y-auto">
                            {wallets.map((wallet, index) => (
                                <div key={index} className="border border-gray-200 shadow-sm flex items-start gap-4 mb-3 p-4 rounded-xl bg-white">
                                    <div className="text-2xl rounded-lg bg-yellow-400 p-3 flex items-center justify-center">
                                        {walletIcons[wallet.icon || 0]}
                                    </div>

                                    <div className="flex flex-col w-full">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-600 text-sm">
                                                {wallet.name}
                                            </span>
                                            <span className="text-lg font-extrabold text-gray-900">
                                                Rp {wallet.balance.toLocaleString('id-ID')}
                                            </span>
                                        </div>

                                        <div className="mt-3">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-linear-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${Math.min(
                                                            (Number(wallet.balance) / 1000000) * 100,
                                                            100
                                                        )}%`
                                                    }}
                                                ></div>
                                            </div>

                                            <div className="flex justify-end mt-1">
                                                <span className="text-xs text-gray-500">
                                                    {Math.round((wallet.balance / 1000000) * 100)}% dari total saldo
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {isDelete && (
                                        <div className="ml-2">
                                            <button onClick={() => {
                                                handleDeleteWallet(wallet.id);
                                            }}>
                                                <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                            ))}
                        </div>
                    )
                )}
            </div>
            <div className="mt-10">
                <div className="flex items-center gap-3">
                    <h2 className="font-bold text-lg whitespace-nowrap">
                        Aksi Cepat
                    </h2>
                    <div className="flex-1 border-b-2 border-purple-500"></div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    <button className="flex flex-col items-center gap-2 p-4 border rounded-md bg-white shadow-sm hover:bg-gray-100 transition-colors">
                        <span className="text-2xl">💸</span>
                        <span className="text-sm font-semibold">Transfer</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 border rounded-md bg-white shadow-sm hover:bg-gray-100 transition-colors">
                        <span className="text-2xl">+</span>
                        <span className="text-sm font-semibold">Top Up</span>
                    </button>
                    <button onClick={() => {
                        setIsDelete(true);
                    }} className="flex flex-col items-center gap-2 p-4 border rounded-md bg-white shadow-sm hover:bg-gray-100 transition-colors">
                        <span className="text-2xl">🗑️</span>
                        <span className="text-sm font-semibold">Hapus Dompet</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 border rounded-md bg-white shadow-sm hover:bg-gray-100 transition-colors">
                        <span className="text-2xl">📊</span>
                        <span className="text-sm font-semibold">Laporan</span>
                    </button>
                </div>
            </div>
            <Modal titleModal="Fitur Belum Tersedia" isOpen={isModalOpen} setIsOpen={closeModal} >
                <form onSubmit={handleSubmit(onSubmit, onError)} className="p-4">
                    <div className="mb-4">
                        <label htmlFor="">Nama Dompet</label>
                        <input type="text" {...register("name", { required: true })} className={`w-full border rounded-md p-2 mt-1 ${errors.name ? 'border-red-500' : 'border-purple-500'}`} placeholder="Masukkan nama dompet" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">Saldo</label>
                        <input type="text" {...register("balance", { required: true, onChange: handleOnlyNumber })} className={`w-full border rounded-md p-2 mt-1 ${errors.balance ? 'border-red-500' : 'border-purple-500'}`} placeholder="Masukkan saldo" />
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