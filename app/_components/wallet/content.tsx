'use client';
import { useEffect, useState } from "react";
import Modal from "../ui/modal";
import Title from "../ui/title";
import { useForm } from "react-hook-form";
import { get, onValue, push, ref, set } from "firebase/database";
import { db } from "@/app/_lib/firebaseDb";
import { auth } from "@/app/_lib/firebaseAuth";
import Swal from "sweetalert2";
import { ExpenseData, IncomeData, TransferData, WalletType } from "@/app/_types/walletType";
import { onAuthStateChanged } from "firebase/auth";
import { UserType } from "@/app/_types/authSliceType";
import { FaTrash } from "react-icons/fa";


export default function Content() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
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

    const { register: registerTransfer, handleSubmit: handleSubmitTransfer, formState: { errors: transferErrors }, reset: resetTransfer } = useForm<TransferData>({
    });
    const { register: registerIncome, handleSubmit: handleSubmitIncome, formState: { errors: incomeErrors }, reset: resetIncome } = useForm<IncomeData>({
    });
    const { register: registerExpense, handleSubmit: handleSubmitExpense, formState: { errors: expenseErrors }, reset: resetExpense } = useForm<ExpenseData>({
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

            const historyRef = ref(db, `users/${user?.uid}/history-income`);
            const newHistoryRef = push(historyRef);
            await set(newHistoryRef, {
                type: 'income',
                amount: removeCommaBalance,
                walletId: response.key,
                timestamp: new Date().getTime(),
                description: 'Pemasukan awal untuk dompet ' + data.name,
                walletName: data.name
            });

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
                    const walletRef = ref(db, `users/${user?.uid}/wallets/${walletId}`);
                    const walletSnapshot = await get(walletRef);
                    if (walletSnapshot.exists()) {
                        const walletBalance = walletSnapshot.val().balance;
                        const totalBalanceRef = ref(db, `users/${user?.uid}/totalBalance`);
                        const totalBalanceSnapshot = await get(totalBalanceRef);
                        const currentTotalBalance = totalBalanceSnapshot.exists() ? totalBalanceSnapshot.val() : 0;
                        await set(totalBalanceRef, currentTotalBalance - walletBalance);
                    }

                    const historyRef = ref(db, `users/${user?.uid}/history-delete`);
                    const newHistoryRef = push(historyRef);
                    await set(newHistoryRef, {
                        type: 'delete',
                        amount: walletSnapshot.exists() ? walletSnapshot.val().balance : 0,
                        walletId: walletId,
                        timestamp: new Date().getTime(),
                        walletName: walletSnapshot.exists() ? walletSnapshot.val().name : 'Unknown Wallet',
                        description: 'Penghapusan dompet ' + (walletSnapshot.exists() ? walletSnapshot.val().name : 'Unknown Wallet')
                    });

                    if (walletSnapshot.exists()) {

                        await set(walletRef, null);
                    }
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

    const handleTransfer = async (data: TransferData) => {
        try {
            console.log(data);
            const removeCommaAmount = Number(data.balance.toString().replace(/,/g, ''));
            const sourceWalletRef = ref(db, `users/${user?.uid}/wallets/${data.sourceWalletId}`);
            const destinationWalletRef = ref(db, `users/${user?.uid}/wallets/${data.destinationWalletId}`);

            const sourceWalletSnapshot = await get(sourceWalletRef);
            const destinationWalletSnapshot = await get(destinationWalletRef);

            if (!sourceWalletSnapshot.exists() || !destinationWalletSnapshot.exists()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Dompet Tidak Ditemukan',
                    text: 'Pastikan dompet sumber dan tujuan valid',
                });
                return;
            }

            if (data.sourceWalletId === data.destinationWalletId) {
                Swal.fire({
                    icon: 'error',
                    title: 'Dompet Sama',
                    text: 'Dompet sumber dan tujuan tidak boleh sama',
                });
                return;
            }

            const sourceBalance = sourceWalletSnapshot.val().balance;
            const destinationBalance = destinationWalletSnapshot.val().balance;

            if (removeCommaAmount > sourceBalance) {
                Swal.fire({
                    icon: 'error',
                    title: 'Saldo Tidak Cukup',
                    text: 'Pastikan saldo di dompet sumber mencukupi untuk transfer',
                });
                return;
            }

            await set(sourceWalletRef, {
                ...sourceWalletSnapshot.val(),
                balance: sourceBalance - removeCommaAmount
            });

            await set(destinationWalletRef, {
                ...destinationWalletSnapshot.val(),
                balance: destinationBalance + removeCommaAmount
            });

            const historyRef = ref(db, `users/${user?.uid}/history-transfer`);
            const newHistoryRef = push(historyRef);
            await set(newHistoryRef, {
                type: 'transfer',
                amount: removeCommaAmount,
                sourceWalletId: data.sourceWalletId,
                destinationWalletId: data.destinationWalletId,
                timestamp: new Date().getTime(),
                description: 'Transfer dari ' + sourceWalletSnapshot.val().name + ' ke ' + destinationWalletSnapshot.val().name,
                sourceWalletName: sourceWalletSnapshot.val().name,
                destinationWalletName: destinationWalletSnapshot.val().name
            });

            const historyIncomeRef = ref(db, `users/${user?.uid}/history-income`);
            const newHistoryIncomeRef = push(historyIncomeRef);
            await set(newHistoryIncomeRef, {
                type: 'income',
                amount: removeCommaAmount,
                walletId: data.destinationWalletId,
                timestamp: new Date().getTime(),
                description: 'Transfer dari ' + sourceWalletSnapshot.val().name,
                walletName: destinationWalletSnapshot.val().name
            });

            const historyExpenseRef = ref(db, `users/${user?.uid}/history-expense`);
            const newHistoryExpenseRef = push(historyExpenseRef);
            await set(newHistoryExpenseRef, {
                type: 'expense',
                amount: removeCommaAmount,
                walletId: data.sourceWalletId,
                expenseCategoryId: '8',
                timestamp: new Date().getTime(),
                description: 'Transfer ke ' + destinationWalletSnapshot.val().name,
                walletName: sourceWalletSnapshot.val().name
            });

            Swal.fire({
                icon: 'success',
                title: 'Transfer Berhasil',
                text: 'Dana telah berhasil ditransfer antar dompet',
            }).then(() => {
                setIsTransferModalOpen(false);
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Transfer Gagal',
                text: 'Terjadi kesalahan saat melakukan transfer',
            });
        }
    }

    const handleIncome = async (data: IncomeData) => {
        try {
            const removeCommaAmount = Number(data.balance.toString().replace(/,/g, ''));
            const walletRef = ref(db, `users/${user?.uid}/wallets/${data.walletId}`);
            const totalWalletBalanceRef = ref(db, `users/${user?.uid}/totalBalance`);
            const walletSnapshot = await get(walletRef);

            if (!walletSnapshot.exists()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Dompet Tidak Ditemukan',
                    text: 'Pastikan dompet valid',
                });
                return;
            }

            const currentBalance = walletSnapshot.val().balance;

            await set(walletRef, {
                ...walletSnapshot.val(),
                balance: currentBalance + removeCommaAmount,
                description: data.description
            });

            const totalBalanceSnapshot = await get(totalWalletBalanceRef);
            const newTotalBalance = (totalBalanceSnapshot.val() || 0) + removeCommaAmount;
            await set(totalWalletBalanceRef, newTotalBalance);

            const historyRef = ref(db, `users/${user?.uid}/history`);
            const newHistoryRef = push(historyRef);
            await set(newHistoryRef, {
                type: 'income',
                amount: removeCommaAmount,
                walletId: data.walletId,
                timestamp: new Date().getTime(),
                description: data.description,
                walletName: walletSnapshot.val().name
            });


            Swal.fire({
                icon: 'success',
                title: 'Pemasukan Berhasil',
                text: 'Dana telah berhasil ditambahkan ke dompet',
            }).then(() => {
                setIsIncomeModalOpen(false);
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Pemasukan Gagal',
                text: 'Terjadi kesalahan saat menambahkan pemasukan',
            });
        }
    }

    const expenseCategories = [
        { id: 1, name: 'Makanan' },
        { id: 2, name: 'Transportasi' },
        { id: 3, name: 'Hiburan' },
        { id: 4, name: 'Belanja' },
        { id: 5, name: 'Tagihan' },
        { id: 6, name: 'Kesehatan' },
        { id: 7, name: 'Pendidikan' },
        { id: 8, name: 'Lainnya' }
    ];

    const handleExpense = async (data: ExpenseData) => {
        try {
            console.log(data);
            const removeCommaAmount = Number(data.balance.toString().replace(/,/g, ''));
            const walletRef = ref(db, `users/${user?.uid}/wallets/${data.walletId}`);
            const totalWalletBalanceRef = ref(db, `users/${user?.uid}/totalBalance`);
            const walletSnapshot = await get(walletRef);
            if (!walletSnapshot.exists()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Dompet Tidak Ditemukan',
                    text: 'Pastikan dompet valid',
                });
                return;
            }

            const currentBalance = walletSnapshot.val().balance;

            if (removeCommaAmount > currentBalance) {
                Swal.fire({
                    icon: 'error',
                    title: 'Saldo Tidak Cukup',
                    text: 'Pastikan saldo di dompet mencukupi untuk pengeluaran',
                });
                return;
            }

            await set(walletRef, {
                ...walletSnapshot.val(),
                balance: currentBalance - removeCommaAmount,
                description: data.description
            });

            const totalBalanceSnapshot = await get(totalWalletBalanceRef);
            const newTotalBalance = (totalBalanceSnapshot.val() || 0) - removeCommaAmount;
            await set(totalWalletBalanceRef, newTotalBalance);

            const historyRef = ref(db, `users/${user?.uid}/history`);
            const newHistoryRef = push(historyRef);
            await set(newHistoryRef, {
                type: 'expense',
                amount: removeCommaAmount,
                walletId: data.walletId,
                expenseCategoryId: data.expenseCategoryId,
                timestamp: new Date().getTime(),
                description: data.description,
                walletName: walletSnapshot.val().name
            });

            Swal.fire({
                icon: 'success',
                title: 'Pengeluaran Berhasil',
                text: 'Dana telah berhasil dikurangkan dari dompet',
            }).then(() => {
                setIsExpenseModalOpen(false);
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Pengeluaran Gagal',
                text: 'Terjadi kesalahan saat menambahkan pengeluaran',
            });
        }
    }

    return (
        <>
            <div>
                <Title onClick={() => setIsModalOpen(true)}>Dompet saya</Title>
            </div>

            {/* Total Balance Card */}
            <div className="mt-4 pr-2">
                <div className="bg-linear-to-br from-cyan-400 to-teal-500 border-[3px] border-slate-900 rounded-3xl p-7 shadow-[6px_6px_0_0_rgb(15,23,42)] text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <span className="text-sm font-bold text-white/90 uppercase tracking-wider block mb-2 relative z-10">Total di Semua Dompet</span>
                    <span className="text-4xl font-black text-white drop-shadow-lg relative z-10">Rp {totalBalance.toLocaleString('id-ID')}</span>
                </div>
            </div>

            {/* Dompet Aktif Section */}
            <div className="mt-6">
                <h2 className="text-lg font-black text-slate-900 mb-4">
                    Dompet Aktif ({wallets.length})
                </h2>

                {loading ? (
                    <div className="w-full h-48 flex items-center justify-center">
                        <span className="text-slate-500 font-semibold">Loading...</span>
                    </div>
                ) : wallets.length === 0 ? (
                    <div className="w-full h-48 flex items-center justify-center">
                        <span className="text-slate-500 font-semibold">Belum ada dompet aktif</span>
                    </div>
                ) : (
                    <div className="space-y-3  overflow-y-auto pr-2 pb-2">
                        {wallets.map((wallet, index) => (
                            <div
                                key={index}
                                className="bg-white border-[3px] border-slate-900 rounded-2xl p-5 shadow-[6px_6px_0_0_rgb(15,23,42)] "
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-amber-400 border-[3px] border-slate-900 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-[3px_3px_0_0_rgb(15,23,42)]">
                                        {walletIcons[wallet.icon || 0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-600 mb-1">Saldo {wallet.name}</p>
                                        <p className="text-2xl font-black text-slate-900">Rp {wallet.balance.toLocaleString('id-ID')}</p>
                                    </div>
                                    {isDelete && (
                                        <button
                                            onClick={() => handleDeleteWallet(wallet.id)}
                                            className="w-10 h-10 bg-rose-100 border-2 border-slate-900 rounded-xl flex items-center justify-center "
                                        >
                                            <FaTrash className="text-rose-600" size={16} />
                                        </button>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="relative">
                                    <div className="w-full h-2 bg-slate-100 rounded-full border-2 border-slate-900 overflow-hidden">
                                        <div
                                            className="h-full bg-linear-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min((Number(wallet.balance) / totalBalance) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 mt-1.5 block">
                                        {Math.round((wallet.balance / totalBalance) * 100)}% dari total saldo
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Aksi Cepat Section */}
            <div className="mt-10 mb-20">
                <h2 className="text-lg font-black text-slate-900 mb-4">
                    Aksi Cepat
                </h2>
                <div className="grid grid-cols-2 gap-3 pr-2">
                    <button
                        onClick={() => setIsTransferModalOpen(prev => !prev)}
                        className="flex flex-col items-center gap-2 bg-white border-[3px] border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0_0_rgb(15,23,42)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgb(15,23,42)] transition-all"
                    >
                        <div className="w-12 h-12 bg-rose-100 border-2 border-slate-900 rounded-xl flex items-center justify-center text-2xl">
                            💸
                        </div>
                        <span className="text-xs font-bold text-slate-900">Transfer</span>
                    </button>

                    <button
                        onClick={() => setIsIncomeModalOpen(prev => !prev)}
                        className="flex flex-col items-center gap-2 bg-white border-[3px] border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0_0_rgb(15,23,42)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgb(15,23,42)] transition-all"
                    >
                        <div className="w-12 h-12 bg-emerald-100 border-2 border-slate-900 rounded-xl flex items-center justify-center text-2xl">
                            📥
                        </div>
                        <span className="text-xs font-bold text-slate-900">Pemasukan</span>
                    </button>

                    <button
                        onClick={() => setIsExpenseModalOpen(prev => !prev)}
                        className="flex flex-col items-center gap-2 bg-white border-[3px] border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0_0_rgb(15,23,42)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgb(15,23,42)] transition-all"
                    >
                        <div className="w-12 h-12 bg-amber-100 border-2 border-slate-900 rounded-xl flex items-center justify-center text-2xl">
                            💸
                        </div>
                        <span className="text-xs font-bold text-slate-900">Pengeluaran</span>
                    </button>

                    {isDelete ? (
                        <button
                            onClick={() => setIsDelete(false)}
                            className="flex flex-col items-center gap-2 bg-white border-[3px] border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0_0_rgb(15,23,42)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgb(15,23,42)] transition-all"
                        >
                            <div className="w-12 h-12 bg-slate-100 border-2 border-slate-900 rounded-xl flex items-center justify-center text-2xl">
                                ❌
                            </div>
                            <span className="text-xs font-bold text-slate-900">Batal</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsDelete(true)}
                            className="flex flex-col items-center gap-2 bg-white border-[3px] border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0_0_rgb(15,23,42)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgb(15,23,42)] transition-all"
                        >
                            <div className="w-12 h-12 bg-violet-100 border-[2px] border-slate-900 rounded-xl flex items-center justify-center text-2xl">
                                🗑️
                            </div>
                            <span className="text-xs font-bold text-slate-900">Hapus Dompet</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Modal Tambah Dompet */}
            <Modal titleModal="Tambah Dompet" isOpen={isModalOpen} setIsOpen={closeModal} >
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

            {/* Modal Transfer */}
            <Modal titleModal="Transfer Antar Dompet" isOpen={isTransferModalOpen} setIsOpen={setIsTransferModalOpen} >
                <form onSubmit={handleSubmitTransfer(handleTransfer, onError)} className="p-4">
                    <div className="mb-4">
                        <label htmlFor="">Sumber Dana</label>
                        <select className={`w-full border rounded-md p-2 mt-1 ${transferErrors.sourceWalletId ? 'border-red-500' : 'border-purple-500'}`} {...registerTransfer("sourceWalletId", { required: true })}>
                            <option value="">Pilih dompet sumber</option>
                            {wallets.map((wallet) => (
                                <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">Tujuan Dana</label>
                        <select className={`w-full border rounded-md p-2 mt-1 ${transferErrors.destinationWalletId ? 'border-red-500' : 'border-purple-500'}`} {...registerTransfer("destinationWalletId", { required: true })}>
                            <option value="">Pilih dompet tujuan</option>
                            {wallets.map((wallet) => (
                                <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">Jumlah Transfer</label>
                        <input type="text" {...registerTransfer("balance", { required: true, onChange: handleOnlyNumber })} className={`w-full border rounded-md p-2 mt-1 ${transferErrors.balance ? 'border-red-500' : 'border-purple-500'}`} placeholder="Masukkan jumlah transfer" />
                    </div>
                    <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition-colors">Simpan</button>
                </form>
            </Modal>

            {/* Modal Pemasukan */}
            <Modal titleModal="Tambah Pemasukan" isOpen={isIncomeModalOpen} setIsOpen={setIsIncomeModalOpen} >
                <form onSubmit={handleSubmitIncome(handleIncome, onError)} className="p-4">
                    <div className="mb-4">
                        <label htmlFor="">Sumber Dana</label>
                        <select className={`w-full border rounded-md p-2 mt-1 ${incomeErrors.walletId ? 'border-red-500' : 'border-purple-500'}`} {...registerIncome("walletId", { required: true })}>
                            <option value="">Pilih dompet sumber</option>
                            {wallets.map((wallet) => (
                                <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">Jumlah Pemasukan</label>
                        <input type="text" {...registerIncome("balance", { required: true, onChange: handleOnlyNumber })} className={`w-full border rounded-md p-2 mt-1 ${incomeErrors.balance ? 'border-red-500' : 'border-purple-500'}`} placeholder="Masukkan jumlah pemasukan" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">Keterangan</label>
                        <input type="text" {...registerIncome("description", { required: true })} className={`w-full border rounded-md p-2 mt-1 ${incomeErrors.description ? 'border-red-500' : 'border-purple-500'}`} placeholder="Masukkan keterangan" />
                    </div>
                    <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition-colors">Simpan</button>
                </form>
            </Modal>

            {/* Modal Pengeluaran */}
            <Modal titleModal="Tambah Pengeluaran" isOpen={isExpenseModalOpen} setIsOpen={setIsExpenseModalOpen} >
                <form onSubmit={handleSubmitExpense(handleExpense, onError)} className="p-4">
                    <div className="mb-4">
                        <label htmlFor="">Sumber Dana</label>
                        <select className={`w-full border rounded-md p-2 mt-1 ${expenseErrors.walletId ? 'border-red-500' : 'border-purple-500'}`} {...registerExpense("walletId", { required: true })}>
                            <option value="">Pilih dompet sumber</option>
                            {wallets.map((wallet) => (
                                <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">Jumlah Pengeluaran</label>
                        <input type="text" {...registerExpense("balance", { required: true, onChange: handleOnlyNumber })} className={`w-full border rounded-md p-2 mt-1 ${expenseErrors.balance ? 'border-red-500' : 'border-purple-500'}`} placeholder="Masukkan jumlah pengeluaran" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">Tujuan</label>
                        <select className={`w-full border rounded-md p-2 mt-1 ${expenseErrors.expenseCategoryId ? 'border-red-500' : 'border-purple-500'}`} {...registerExpense("expenseCategoryId", { required: true })}>
                            <option value="">Pilih kategori pengeluaran</option>
                            {expenseCategories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">Keterangan</label>
                        <input type="text" {...registerExpense("description", { required: true })} className={`w-full border rounded-md p-2 mt-1 ${expenseErrors.description ? 'border-red-500' : 'border-purple-500'}`} placeholder="Masukkan keterangan" />
                    </div>
                    <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition-colors">Simpan</button>
                </form>
            </Modal>
        </>
    )
}