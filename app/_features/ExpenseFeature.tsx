import { get, push, ref, set } from "firebase/database";
import Modal from "../_components/ui/modal";
import { db } from "../_lib/firebaseDb";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { ExpenseData, WalletType } from "../_types/walletType";
import { useForm } from "react-hook-form";
import { UserType } from "../_types/authSliceType";
import { categoryData } from "../_data/categoryData";
import Helper from "../_lib/helper";

interface ExpenseFeatureProps {
    user: UserType;
    setIsExpenseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isExpenseModalOpen: boolean;
}

export default function ExpenseFeature({ user, setIsExpenseModalOpen, isExpenseModalOpen }: ExpenseFeatureProps) {
    const { register: registerExpense, handleSubmit: handleSubmitExpense, formState: { errors: expenseErrors }, reset: resetExpense } = useForm<ExpenseData>({
    });
    const [wallets, setWallets] = useState<WalletType[]>([]);

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

    const onError = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Terjadi Kesalahan',
            text: 'Periksa kembali semua field yang wajib diisi',
        });
    }

    useEffect(() => {
        if (!user) return;

        const fetchWallets = async () => {
            try {
                const walletsRef = ref(db, `users/${user.uid}/wallets`);
                const snapshot = await get(walletsRef);

                if (snapshot.exists()) {
                    const walletsData = snapshot.val();

                    const walletsList = Object.keys(walletsData).map((key) => ({
                        id: key,
                        ...walletsData[key],
                    }));

                    setWallets(walletsList);
                } else {
                    setWallets([]);
                }

            } catch (error) {
                console.log("Error fetching wallets:", error);
            }
        };
        fetchWallets();
    }, [user]);

    return (
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
                    <input type="text" {...registerExpense("balance", { required: true, onChange: Helper.handleOnlyNumber })} className={`w-full border rounded-md p-2 mt-1 ${expenseErrors.balance ? 'border-red-500' : 'border-purple-500'}`} placeholder="Masukkan jumlah pengeluaran" />
                </div>
                <div className="mb-4">
                    <label htmlFor="">Tujuan</label>
                    <select className={`w-full border rounded-md p-2 mt-1 ${expenseErrors.expenseCategoryId ? 'border-red-500' : 'border-purple-500'}`} {...registerExpense("expenseCategoryId", { required: true })}>
                        <option value="">Pilih kategori pengeluaran</option>
                        {categoryData.map((category) => (
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
    )
}