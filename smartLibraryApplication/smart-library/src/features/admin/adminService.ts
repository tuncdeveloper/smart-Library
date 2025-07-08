import axios from 'axios';
import { AdminLoginDTO, AdminDetailDTO } from '../../types/admin';

const BASE_URL = '/api/admin';

// login endpoint'i sadece "Giriş başarılı" veya hata mesajı dönüyor,
// yani dönüş tipi string olabilir, ama başarılı olup olmadığı koddan anlaşılıyor
export const adminLogin = async (data: AdminLoginDTO): Promise<string> => {
    const response = await axios.post<string>(`${BASE_URL}/login`, data);
    return response.data; // "Giriş başarılı" veya hata mesajı (örneğin 401 için hata fırlatır)
};

// profil bilgisi endpoint'i AdminDetailDTO dönüyor
export const getAdminProfile = async (username: string): Promise<AdminDetailDTO> => {
    const response = await axios.get<AdminDetailDTO>(`${BASE_URL}/profile/${username}`);
    return response.data;
};
