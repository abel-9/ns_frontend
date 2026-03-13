export interface Me {
    id: string;
    email: string;
    role: string;
    accounts: Account[];
    role_id: string;
}

interface Account {
    id: string;
    provider: string;
    provider_account_id: string;
    is_verified: boolean;
}