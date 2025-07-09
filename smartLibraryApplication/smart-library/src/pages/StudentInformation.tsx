import React, { useState, useEffect } from 'react';
import { Edit, Save, X, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StudentUpdateDTO } from '../types/student';
import {updateStudent} from "../features/student/studentService";

const StudentInformation: React.FC = () => {
    const { user, isLoading, login } = useAuth();
    const [formData, setFormData] = useState<StudentUpdateDTO | null>(null);
    const [editingField, setEditingField] = useState<keyof Omit<StudentUpdateDTO, 'password'> | null>(null);
    const [editValue, setEditValue] = useState<string | number>('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                password: '',
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
        setError(null);
    };

    const handleSaveEdit = async () => {
        if (!editingField || !formData) return;

        setIsUpdating(true);
        setError(null);

        try {
            // Sadece düzenlenen alanı güncelle
            const dataToUpdate: StudentUpdateDTO = {
                id: formData.id,
                username: editingField === 'username' ? editValue as string : formData.username,
                email: editingField === 'email' ? editValue as string : formData.email,
                fullName: editingField === 'fullName' ? editValue as string : formData.fullName,
                phone: editingField === 'phone' ? editValue as string : formData.phone,
                password: '', // Şifre güncelleme ayrı fonksiyonda
            };

            console.log('Güncelleme verisi:', dataToUpdate);

            const updated = await updateStudent(formData.id, dataToUpdate);

            setFormData(updated);
            setEditingField(null);
            setEditValue('');

            // AuthContext'teki user state'i güncelle
            const updatedUser = {
                ...user!,
                username: updated.username,
                email: updated.email,
                fullName: updated.fullName,
                phone: updated.phone,
            };

            login(updatedUser);
            alert('Bilgi başarıyla güncellendi!');
        } catch (error) {
            const errorMessage = (error as Error).message;
            setError(errorMessage);
            console.error('Güncelleme hatası:', error);
            alert('Güncelleme sırasında hata oluştu: ' + errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSavePassword = async () => {
        if (!formData) return;

        if (!oldPassword) {
            alert('Lütfen eski şifrenizi girin!');
            return;
        }

        if (!newPassword) {
            alert('Lütfen yeni şifrenizi girin!');
            return;
        }

        if (newPassword.length < 3) {
            alert('Yeni şifre en az 3 karakter olmalıdır!');
            return;
        }

        setIsUpdating(true);
        setError(null);

        try {
            const passwordUpdateData: StudentUpdateDTO = {
                id: formData.id,
                username: formData.username,
                email: formData.email,
                fullName: formData.fullName,
                phone: formData.phone,
                oldPassword: oldPassword, // Eski şifre
                newPassword: newPassword, // Yeni şifre
            };

            const updated = await updateStudent(formData.id, passwordUpdateData);

            setPasswordConfirmVisible(false);
            setOldPassword('');
            setNewPassword('');
            alert('Şifre başarıyla güncellendi!');

            // AuthContext'teki user state'i güncelle
            const updatedUser = {
                ...user!,
                username: updated.username,
                email: updated.email,
                fullName: updated.fullName,
                phone: updated.phone,
            };

            login(updatedUser);
        } catch (error) {
            const errorMessage = (error as Error).message;
            setError(errorMessage);
            alert('Şifre güncelleme hatası: ' + errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

// verifyPassword import'unu kaldır

    const handleCancelPasswordEdit = () => {
        setPasswordConfirmVisible(false);
        setOldPassword('');
        setNewPassword('');
        setError(null);
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
                            disabled={isUpdating}
                        />
                        <button
                            onClick={handleSaveEdit}
                            disabled={isUpdating}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: isUpdating ? '#ccc' : '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: isUpdating ? 'not-allowed' : 'pointer',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseEnter={(e) => !isUpdating && (e.currentTarget.style.backgroundColor = '#45a049')}
                            onMouseLeave={(e) => !isUpdating && (e.currentTarget.style.backgroundColor = '#4CAF50')}
                        >
                            <Save size={14} />
                            {isUpdating ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                        <button
                            onClick={() => setEditingField(null)}
                            disabled={isUpdating}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: isUpdating ? '#ccc' : '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: isUpdating ? 'not-allowed' : 'pointer',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseEnter={(e) => !isUpdating && (e.currentTarget.style.backgroundColor = '#d32f2f')}
                            onMouseLeave={(e) => !isUpdating && (e.currentTarget.style.backgroundColor = '#f44336')}
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
                    disabled={isUpdating}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: isUpdating ? '#ccc' : '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isUpdating ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => !isUpdating && (e.currentTarget.style.backgroundColor = '#5a6fd8')}
                    onMouseLeave={(e) => !isUpdating && (e.currentTarget.style.backgroundColor = '#667eea')}
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

                {error && (
                    <div style={{
                        margin: '20px 30px 0',
                        padding: '15px',
                        backgroundColor: '#ffebee',
                        borderRadius: '8px',
                        border: '1px solid #f44336',
                        color: '#c62828',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <div style={{ padding: '30px' }}>
                    <InfoRow label="Kullanıcı Adı" field="username" value={formData.username} />
                    <InfoRow label="Ad Soyad" field="fullName" value={formData.fullName} />
                    <InfoRow label="Email" field="email" value={formData.email} type="email" />
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
                            disabled={isUpdating}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: isUpdating ? '#ccc' : '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: isUpdating ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseEnter={(e) => !isUpdating && (e.currentTarget.style.backgroundColor = '#5a6fd8')}
                            onMouseLeave={(e) => !isUpdating && (e.currentTarget.style.backgroundColor = '#667eea')}
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
                                disabled={isUpdating}
                                style={{
                                    padding: '12px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    border: '2px solid #e9ecef',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease',
                                    boxSizing: 'border-box',
                                    backgroundColor: isUpdating ? '#f5f5f5' : 'white',
                                }}
                                onFocus={(e) => !isUpdating && (e.currentTarget.style.borderColor = '#667eea')}
                                onBlur={(e) => !isUpdating && (e.currentTarget.style.borderColor = '#e9ecef')}
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
                                disabled={isUpdating}
                                style={{
                                    padding: '12px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    border: '2px solid #e9ecef',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease',
                                    boxSizing: 'border-box',
                                    backgroundColor: isUpdating ? '#f5f5f5' : 'white',
                                }}
                                onFocus={(e) => !isUpdating && (e.currentTarget.style.borderColor = '#667eea')}
                                onBlur={(e) => !isUpdating && (e.currentTarget.style.borderColor = '#e9ecef')}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={handleSavePassword}
                                disabled={isUpdating}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: isUpdating ? '#ccc' : '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseEnter={(e) => !isUpdating && (e.currentTarget.style.backgroundColor = '#45a049')}
                                onMouseLeave={(e) => !isUpdating && (e.currentTarget.style.backgroundColor = '#4CAF50')}
                            >
                                <Save size={16} />
                                {isUpdating ? 'Kaydediliyor...' : 'Şifreyi Kaydet'}
                            </button>
                            <button
                                onClick={handleCancelPasswordEdit}
                                disabled={isUpdating}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: isUpdating ? '#ccc' : '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseEnter={(e) => !isUpdating && (e.currentTarget.style.backgroundColor = '#d32f2f')}
                                onMouseLeave={(e) => !isUpdating && (e.currentTarget.style.backgroundColor = '#f44336')}
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
