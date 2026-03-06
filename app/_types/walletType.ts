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
    description: string;
    sourceWalletName?: string;
    destinationWalletName?: string;
}

export interface IncomeData {
    walletId: string;
    balance: number;
    description: string;
    walletName?: string;
}

export interface ExpenseData {
    walletId: string;
    balance: number;
    expenseCategoryId: string;
    description: string;
    walletName?: string;
}

export interface historyData {
    expenseCategoryId: string;
    amount: number;
    type: string;
    timestamp: string;
    walletId: string;
    walletName?: string;
    description?: string;
}