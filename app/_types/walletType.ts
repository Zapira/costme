export interface WalletType {
    name: string;
    balance: number;
    icon: any;
    id: string;
}

export interface TransferData {
    sourceWalletId: string;
    destinationWalletId: string;
    balance: number;
}

export interface IncomeData {
    walletId: string;
    balance: number;
}

export interface ExpenseData {
    walletId: string;
    balance: number;
    expenseCategoryId: string;
}

export interface historyData {
    expenseCategoryId: string;
    amount: number;
    type: string;
    timestamp: string;
    walletId: string;
    walletName?: string;
}