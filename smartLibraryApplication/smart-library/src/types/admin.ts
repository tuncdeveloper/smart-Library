export type AdminDetailDTO = {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    position: string;
    createdAt: string; // ISO tarih formatında
    isActive: boolean;
};

export type AdminLoginDTO = {
    username: string;
    password: string;
};
