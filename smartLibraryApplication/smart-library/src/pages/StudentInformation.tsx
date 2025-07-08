import React, { useState, useEffect } from 'react';
import { Edit, Save, X, Lock } from 'lucide-react';

type StudentUpdateDTO = {
    id: number;
    username: string;
    password?: string; // Optional yapıldı
    email: string;
    fullName: string;
    department: string;
    grade: number;
    phone: string;
};

type StudentLoginResponseDTO = {
    id: number;
    message: string;
    username: string;
    email: string;
    fullName: string;
    department: string;
    grade: number;
    phone: string;
};

const useAuth = () => {
    const [user, setUser] = useState<StudentLoginResponseDTO | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('student');
            if (storedUser) {
                const parsedUser: StudentLoginResponseDTO = JSON.parse(storedUser);
                console.log('localStorage\'dan kullanıcı yüklendi:', parsedUser);
                setUser(parsedUser);
            }
        } catch (error) {
            console.error('localStorage\'dan kullanıcı yüklenemedi:', error);
            localStorage.removeItem('student');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { user, isLoading };
};

const updateStudent = async (id: number, data: StudentUpdateDTO): Promise<StudentUpdateDTO> => {
    try {
        // Şifre alanı boşsa payload'dan kaldır
        const payload = { ...data };
        if (payload.password === '') {
            delete payload.password;
        }

        const response = await fetch(`/api/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedStudent: StudentUpdateDTO = await response.json();
        return updatedStudent;
    } catch (error) {
        console.error('API çağrısı hatası:', error);
        throw error;
    }
};

const StudentInformation: React.FC = () => {
    const { user, isLoading } = useAuth();
    const [formData, setFormData] = useState<StudentUpdateDTO | null>(null);
    const [editingField, setEditingField] = useState<keyof Omit<StudentUpdateDTO, 'password'> | null>(null); // Password alanı hariç
    const [editValue, setEditValue] = useState<string | number>('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                department: user.department,
                grade: user.grade,
                phone: user.phone,
            });
        }
    }, [user]);

    if (isLoading || !formData) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    color: 'white',
                    fontSize: '18px',
                    fontFamily: 'Arial, sans-serif'
                }}>
                    Yükleniyor...
                </div>
            </div>
        );
    }

    const handleEditClick = (field: keyof Omit<StudentUpdateDTO, 'password'>, currentValue: string | number) => {
        setEditingField(field);
        setEditValue(currentValue);
    };

    const handleSaveEdit = async () => {
        if (!editingField || !formData) return;

        try {
            const dataToUpdate: StudentUpdateDTO = {
                ...formData,
                [editingField]: editValue,
            };

            const updated = await updateStudent(formData.id, dataToUpdate);

            setFormData({
                ...updated,
            });

            setEditingField(null);
            setEditValue('');

            const updatedUserLocalStorage: StudentLoginResponseDTO = {
                id: updated.id,
                message: 'success',
                username: updated.username,
                email: updated.email,
                fullName: updated.fullName,
                department: updated.department,
                grade: updated.grade,
                phone: updated.phone,
            };

            localStorage.setItem('student', JSON.stringify(updatedUserLocalStorage));
            alert('Bilgi başarıyla güncellendi ve veritabanına kaydedildi!');
        } catch (error) {
            alert('Güncelleme sırasında hata oluştu: ' + (error as Error).message);
            console.error('Güncelleme hatası:', error);
        }
    };

    const handleSavePassword = async () => {
        if (!formData) return;

        // Şifre doğrulama mantığı burada olmalı
        // Basit örnek: Eski şifre doğru mu?
        // Gerçek uygulamada API üzerinden doğrulama yapılmalı
        if (!oldPassword) {
            alert('Lütfen eski şifrenizi girin!');
            return;
        }

        if (!newPassword) {
            alert('Lütfen yeni şifrenizi girin!');
            return;
        }

        try {
            const updatedData: StudentUpdateDTO = {
                ...formData,
                password: newPassword,
            };

            const updated = await updateStudent(formData.id, updatedData);

            setFormData({
                ...updated,
            });

            setPasswordConfirmVisible(false);
            setOldPassword('');
            setNewPassword('');

            alert('Şifre başarıyla güncellendi!');

            const updatedUserLocalStorage: StudentLoginResponseDTO = {
                id: updated.id,
                message: 'success',
                username: updated.username,
                email: updated.email,
                fullName: updated.fullName,
                department: updated.department,
                grade: updated.grade,
                phone: updated.phone,
            };

            localStorage.setItem('student', JSON.stringify(updatedUserLocalStorage));
        } catch (error) {
            alert('Şifre güncelleme hatası: ' + (error as Error).message);
        }
    };

    const InfoRow = ({
                         label,
                         field,
                         value,
                         type = 'text',
                     }: {
        label: string;
        field: keyof Omit<StudentUpdateDTO, 'password'>;
        value: string | number;
        type?: string;
    }) => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 0',
                borderBottom: '1px solid #e0e0e0',
                fontSize: '16px',
                color: '#555',
                transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#764ba2'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#555'}
        >
            <div style={{ flex: 1 }}>
                {editingField === field ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: 'bold', minWidth: '140px' }}>{label}:</span>
                        <input
                            type={type}
                            value={editValue}
                            onChange={(e) =>
                                setEditValue(
                                    type === 'number'
                                        ? Number(e.target.value)
                                        : e.target.value
                                )
                            }
                            style={{
                                padding: '10px 12px',
                                border: '2px solid #667eea',
                                borderRadius: '8px',
                                fontSize: '14px',
                                minWidth: '200px',
                                outline: 'none',
                                transition: 'border-color 0.3s ease',
                            }}
                            min={type === 'number' ? 1 : undefined}
                            max={type === 'number' ? 4 : undefined}
                            autoFocus
                        />
                        <button
                            onClick={handleSaveEdit}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                        >
                            <Save size={14} />
                            Kaydet
                        </button>
                        <button
                            onClick={() => setEditingField(null)}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
                        >
                            <X size={14} />
                            İptal
                        </button>
                    </div>
                ) : (
                    <span>
                        <strong>{label}:</strong> {value}
                    </span>
                )}
            </div>
            {editingField !== field && (
                <button
                    onClick={() => handleEditClick(field, value)}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6fd8'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
                >
                    <Edit size={14} />
                    Düzenle
                </button>
            )}
        </div>
    );

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '40px 20px',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <div
                style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '30px',
                        textAlign: 'center',
                        color: 'white',
                    }}
                >
                    <h1 style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
                        Bilgilerim
                    </h1>
                    <p style={{ margin: '10px 0 0', fontSize: '16px', opacity: '0.9' }}>
                        Kişisel bilgilerinizi görüntüleyin ve düzenleyin
                    </p>
                </div>

                <div style={{ padding: '30px' }}>
                    <InfoRow label="Kullanıcı Adı" field="username" value={formData.username} />
                    <InfoRow label="Ad Soyad" field="fullName" value={formData.fullName} />
                    <InfoRow label="Email" field="email" value={formData.email} type="email" />
                    <InfoRow label="Bölüm" field="department" value={formData.department} />
                    <InfoRow label="Sınıf" field="grade" value={formData.grade} type="number" />
                    <InfoRow label="Telefon" field="phone" value={formData.phone} />

                    {/* Şifre alanı */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '20px 0',
                            fontSize: '16px',
                            color: '#555',
                            transition: 'color 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#764ba2'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#555'}
                    >
                        <span>
                            <strong>Şifre:</strong> ••••••••
                        </span>
                        <button
                            onClick={() => setPasswordConfirmVisible(true)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6fd8'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
                        >
                            <Lock size={14} />
                            Şifreyi Değiştir
                        </button>
                    </div>
                </div>

                {passwordConfirmVisible && (
                    <div
                        style={{
                            margin: '0 30px 30px',
                            backgroundColor: '#f8f9fa',
                            padding: '25px',
                            borderRadius: '10px',
                            border: '1px solid #e9ecef',
                        }}
                    >
                        <h3 style={{
                            marginBottom: '20px',
                            color: '#333',
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Lock size={18} />
                            Şifreyi Güncelle
                        </h3>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="oldPassword" style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 'bold',
                                color: '#555'
                            }}>
                                Eski Şifre
                            </label>
                            <input
                                id="oldPassword"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                style={{
                                    padding: '12px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    border: '2px solid #e9ecef',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#e9ecef'}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="newPassword" style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 'bold',
                                color: '#555'
                            }}>
                                Yeni Şifre
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{
                                    padding: '12px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    border: '2px solid #e9ecef',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#e9ecef'}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={handleSavePassword}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                            >
                                <Save size={16} />
                                Şifreyi Kaydet
                            </button>
                            <button
                                onClick={() => setPasswordConfirmVisible(false)}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
                            >
                                <X size={16} />
                                İptal
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentInformation;