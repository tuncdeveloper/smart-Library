export type StudentListDTO = {
    id: number;
    fullName: string;
    email: string;
};

export type StudentLoginDTO = {
    username: string;
    password: string;
};

export type StudentLoginResponseDTO = {
    id: number; // Backend'den Long olarak gelir ama JS'de number olarak kullanılır
    message: string;
    username: string;
    email: string;
    fullName: string;
    department: string;
    grade: number;
    phone: string;
};

export type StudentRegisterDTO = {
    username: string;
    password: string;
    email: string;
    fullName: string;
    department: string;
    grade: number; // Backend'de Integer ama frontend'de number
    phone: string;
};

// src/types/student.ts

export type StudentUpdateDTO = {
    id: number;
    username: string;
    password: string;
    email: string;
    fullName: string;
    department: string;
    grade: number;
    phone: string;
};
