import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStudent } from '../features/student/studentService';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await registerStudent(formData);
            alert(response);
            navigate('/login');
        } catch (error: any) {
            const errorMsg = error.response?.data || error.message;
            setError(`Kayıt başarısız: ${errorMsg}`);
            console.error('Kayıt hatası:', error);
        } finally {
            setLoading(false);
        }
    };

    // Stil tanımlamaları aynen kalabilir

    const containerStyle: React.CSSProperties = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    };

    const formContainerStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        animation: 'slideIn 0.6s ease-out',
    };

    const titleStyle: React.CSSProperties = {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#2c3e50',
        fontSize: '28px',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        marginTop: '6px',
        border: '2px solid #e1e5e9',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        outline: 'none',
        backgroundColor: '#fff',
        boxSizing: 'border-box',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        marginBottom: '16px',
        color: '#2c3e50',
        fontWeight: '600',
        fontSize: '14px',
    };

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px 20px',
        backgroundColor: loading ? '#95a5a6' : '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        marginTop: '20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
    };

    const loadingSpinnerStyle: React.CSSProperties = {
        display: 'inline-block',
        width: '20px',
        height: '20px',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        borderTopColor: '#ffffff',
        animation: 'spin 1s linear infinite',
        marginRight: '10px',
        verticalAlign: 'middle',
    };

    const errorStyle: React.CSSProperties = {
        color: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        padding: '10px',
        borderRadius: '8px',
        margin: '10px 0',
        textAlign: 'center',
        fontSize: '14px',
    };

    const keyframes = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;

    return (
        <>
            <style>{keyframes}</style>
            <div style={containerStyle}>
                <div style={formContainerStyle}>
                    <h2 style={titleStyle}>Kayıt Ol</h2>

                    {error && <div style={errorStyle}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {[
                            { name: 'username', label: '👤 Kullanıcı Adı', type: 'text', placeholder: 'Kullanıcı adınızı giriniz' },
                            { name: 'password', label: '🔒 Parola', type: 'password', placeholder: 'Güçlü bir parola oluşturun' },
                            { name: 'email', label: '📧 Email', type: 'email', placeholder: 'ornek@email.com' },
                            { name: 'fullName', label: '🏷️ Ad Soyad', type: 'text', placeholder: 'Adınız ve soyadınız' },
                            { name: 'phone', label: '📱 Telefon', type: 'tel', placeholder: '+90 5XX XXX XX XX' },
                        ].map((field) => (
                            <label key={field.name} style={labelStyle}>
                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                    {field.label}
                                </span>
                                <input
                                    name={field.name}
                                    type={field.type}
                                    value={formData[field.name as keyof typeof formData]}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                    placeholder={field.placeholder}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e1e5e9';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </label>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            style={buttonStyle}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.background = '#667eea';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <span style={loadingSpinnerStyle}></span>
                                    Kayıt oluyor...
                                </>
                            ) : (
                                '🚀 Kayıt Ol'
                            )}
                        </button>
                    </form>

                    <div style={{
                        textAlign: 'center',
                        marginTop: '20px',
                        color: '#7f8c8d',
                        fontSize: '14px'
                    }}>
                        Zaten hesabınız var mı?
                        <a href="/login" style={{
                            color: '#667eea',
                            textDecoration: 'none',
                            fontWeight: '600',
                            marginLeft: '5px'
                        }}>
                            Giriş Yapın
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
