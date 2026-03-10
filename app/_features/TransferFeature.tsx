import { useEffect, useState } from "react";
import Modal from "../_components/ui/modal";
import { useForm } from "react-hook-form";
import { TransferData, WalletType } from "../_types/walletType";
import Swal from "sweetalert2";
import { get, push, ref, set } from "firebase/database";
import Helper from "../_lib/helper";
import { db } from "../_lib/firebaseDb";
import { UserType } from "../_types/authSliceType";

interface TransferFeatureProps {
    user: UserType;
    setIsTransferModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isTransferModalOpen: boolean;
}

export default function TransferFeature({ user, setIsTransferModalOpen, isTransferModalOpen }: TransferFeatureProps) {
    const { register: registerTransfer, handleSubmit: handleSubmitTransfer, formState: { errors: transferErrors }, reset: resetTransfer } = useForm<TransferData>({
    });
    const [wallets, setWallets] = useState<WalletType[]>([]);


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
                    <input type="text" {...registerTransfer("balance", { required: true, onChange: Helper.handleOnlyNumber })} className={`w-full border rounded-md p-2 mt-1 ${transferErrors.balance ? 'border-red-500' : 'border-purple-500'}`} placeholder="Masukkan jumlah transfer" />
                </div>
                <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition-colors">Simpan</button>
            </form>
        </Modal>
    )
}