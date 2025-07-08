export type LoanCreateDTO = {
    studentId: number;
    bookId: number;
    dueDate?: string; // Optional, ISO string
    notes?: string;
};

export type LoanDetailDTO = {
    id: number;
    studentId: number;
    studentName: string;
    bookId: number;
    bookTitle: string;
    loanDate: string;
    dueDate: string;
    returnDate: string | null;
    notes?: string;
};

export type LoanListDTO = {
    id: number;
    studentName: string;
    bookTitle: string;
    loanDate: string;
    dueDate: string;
    returnDate: string | null;
};

export type LoanUpdateDTO = {
    returnDate: string;
    notes?: string;
};
