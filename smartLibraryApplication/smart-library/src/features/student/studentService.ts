import axios from 'axios';
import {
    StudentListDTO,
    StudentLoginDTO,
    StudentRegisterDTO,
    StudentLoginResponseDTO, StudentUpdateDTO  // yeni ekleme
} from '../../types/student';

const BASE_URL = '/api/students';

export const registerStudent = async (data: StudentRegisterDTO): Promise<string> => {
    const res = await axios.post<string>(`${BASE_URL}/register`, data);
    return res.data;
};

// login fonksiyonu artık obje dönüyor
export const loginStudent = async (data: StudentLoginDTO): Promise<StudentLoginResponseDTO> => {
    const res = await axios.post<StudentLoginResponseDTO>(`${BASE_URL}/login`, data);
    return res.data;
};

export const getAllStudents = async (): Promise<StudentListDTO[]> => {
    const res = await axios.get<StudentListDTO[]>(BASE_URL);
    return res.data;
};

export const getStudentById = async (id: number): Promise<StudentListDTO> => {
    const res = await axios.get<StudentListDTO>(`${BASE_URL}/${id}`);
    return res.data;
};

export const updateStudent = async (id: number, data: StudentUpdateDTO): Promise<string> => {
    const res = await axios.put<string>(`${BASE_URL}/${id}`, data);
    return res.data;
};

export const deleteStudent = async (id: number): Promise<string> => {
    const res = await axios.delete<string>(`${BASE_URL}/${id}`);
    return res.data;
};
