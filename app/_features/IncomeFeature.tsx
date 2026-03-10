import { useForm } from "react-hook-form";
import Modal from "../_components/ui/modal";
import { IncomeData, WalletType } from "../_types/walletType";
import { get, push, ref, set } from "firebase/database";
import { UserType } from "../_types/authSliceType";
import { db } from "../_lib/firebaseDb";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import Helper from "../_lib/helper";

interface IncomeFeatureProps {
    user: UserType;
    setIsIncomeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isIncomeModalOpen: boolean;
}

export default function IncomeFeature({ user, setIsIncomeModalOpen, isIncomeModalOpen }: IncomeFeatureProps) {
    const { register: registerIncome, handleSubmit: handleSubmitIncome, formState: { errors: incomeErrors }, reset: resetIncome } = useForm<IncomeData>({
    });
    const [wallets, setWallets] = useState<WalletType[]>([]);

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
                    <input type="text" {...registerIncome("balance", { required: true, onChange: Helper.handleOnlyNumber })} className={`w-full border rounded-md p-2 mt-1 ${incomeErrors.balance ? 'border-red-500' : 'border-purple-500'}`} placeholder="Masukkan jumlah pemasukan" />
                </div>
                <div className="mb-4">
                    <label htmlFor="">Keterangan</label>
                    <input type="text" {...registerIncome("description", { required: true })} className={`w-full border rounded-md p-2 mt-1 ${incomeErrors.description ? 'border-red-500' : 'border-purple-500'}`} placeholder="Masukkan keterangan" />
                </div>
                <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition-colors">Simpan</button>
            </form>
        </Modal>
    );
}