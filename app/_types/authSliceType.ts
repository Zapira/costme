export interface AuthStateType {
    isLoggedIn: boolean;
    user: {
        uid: string;
        email: string | null;
    } | null;
}