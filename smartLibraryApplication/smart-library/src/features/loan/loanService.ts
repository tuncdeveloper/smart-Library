import axios from 'axios';
import {
    LoanCreateDTO,
    LoanDetailDTO,
    LoanListDTO
} from '../../types/loan';

const BASE_URL = '/api/loans';

export const createLoan = async (data: LoanCreateDTO): Promise<void> => {
    await axios.post<void>(BASE_URL, data);
};

export const getAllLoans = async (): Promise<LoanListDTO[]> => {
    const res = await axios.get<LoanListDTO[]>(BASE_URL);
    return res.data;
};

export const getLoanById = async (id: number): Promise<LoanDetailDTO> => {
    const res = await axios.get<LoanDetailDTO>(`${BASE_URL}/${id}`);
    return res.data;
};

export const getLoansByStudentId = async (studentId: number): Promise<LoanListDTO[]> => {
    const res = await axios.get<LoanListDTO[]>(`${BASE_URL}/student/${studentId}`);
    return res.data;
};

export const deleteLoan = async (id: number): Promise<void> => {
    await axios.delete<void>(`${BASE_URL}/${id}`);
};
