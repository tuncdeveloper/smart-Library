import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginStudent } from '../features/student/studentService';
import { useAuth } from '../contexts/AuthContext';
import { StudentLoginResponseDTO } from '../types/student';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!username || !password) {
            alert('Kullanıcı adı ve şifre giriniz!');
            setLoading(false);
            return;
        }

        try {
            const loginDto = { username, password };
            const response: StudentLoginResponseDTO = await loginStudent(loginDto);

            if (response.username) {
                login(response);
                navigate('/student');
            } else {
                alert("Giriş başarısız. Kullanıcı adı veya şifre hatalı.");
            }
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                alert("Kayıt bulunamadı. Lütfen kullanıcı bilgilerinizi kontrol edin.");
            } else {
                alert("Giriş sırasında bir hata oluştu: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const goToRegister = () => {
        navigate('/register');
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 18px',
        marginTop: '8px',
        border: '2px solid #e1e5e9',
        borderRadius: '10px',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        outline: 'none',
        backgroundColor: '#fff',
        boxSizing: 'border-box' as const,
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '20px',
        color: '#2c3e50',
        fontWeight: '600',
        fontSize: '15px',
    };

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    };

    const formContainerStyle = {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        borderRadius: '24px',
        padding: '45px',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        animation: 'fadeInUp 0.8s ease-out',
    };

    const titleStyle = {
        textAlign: 'center' as const,
        marginBottom: '35px',
        color: '#2c3e50',
        fontSize: '32px',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '-0.5px',
    };

    const primaryButtonStyle = {
        width: '100%',
        padding: '16px 24px',
        backgroundColor: loading ? '#95a5a6' : '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: '15px',
        position: 'relative' as const,
        overflow: 'hidden',
        transform: loading ? 'scale(0.98)' : 'scale(1)',
        boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
    };

    const secondaryButtonStyle = {
        width: '100%',
        padding: '16px 24px',
        backgroundColor: 'transparent',
        color: '#667eea',
        border: '2px solid #667eea',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: 'none',
    };

    const loadingSpinnerStyle = {
        display: 'inline-block',
        width: '20px',
        height: '20px',
        border: '3px solid #ffffff',
        borderRadius: '50%',
        borderTopColor: 'transparent',
        animation: 'spin 1s ease-in-out infinite',
        marginRight: '10px',
    };

    const welcomeTextStyle = {
        textAlign: 'center' as const,
        color: '#7f8c8d',
        fontSize: '16px',
        marginBottom: '30px',
        lineHeight: '1.6',
    };

    const dividerStyle = {
        textAlign: 'center' as const,
        margin: '25px 0',
        color: '#95a5a6',
        fontSize: '14px',
        position: 'relative' as const,
    };

    const dividerLineStyle = {
        position: 'absolute' as const,
        top: '50%',
        left: '0',
        right: '0',
        height: '1px',
        background: 'linear-gradient(to right, transparent, #e1e5e9, transparent)',
        zIndex: 1,
    };

    const dividerTextStyle = {
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '0 15px',
        position: 'relative' as const,
        zIndex: 2,
    };

    // CSS keyframes
    const keyframes = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
    `;

    return (
        <>
            <style>{keyframes}</style>
            <div style={containerStyle}>
                <div style={formContainerStyle}>
                    <h2 style={titleStyle}>Hoş Geldiniz</h2>
                    <p style={welcomeTextStyle}>
                        Hesabınıza giriş yapın ve öğrenci portalınıza erişin
                    </p>

                    <form onSubmit={handleSubmit}>
                        <label style={labelStyle}>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                👤 Kullanıcı Adı
                            </span>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                style={inputStyle}
                                placeholder="Kullanıcı adınızı giriniz"
                                onFocus={(e) => {
                                    (e.target as HTMLInputElement).style.borderColor = '#667eea';
                                    (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.15)';
                                    (e.target as HTMLInputElement).style.transform = 'scale(1.02)';
                                }}
                                onBlur={(e) => {
                                    (e.target as HTMLInputElement).style.borderColor = '#e1e5e9';
                                    (e.target as HTMLInputElement).style.boxShadow = 'none';
                                    (e.target as HTMLInputElement).style.transform = 'scale(1)';
                                }}
                            />
                        </label>

                        <label style={labelStyle}>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                🔒 Şifre
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={inputStyle}
                                placeholder="Şifrenizi giriniz"
                                onFocus={(e) => {
                                    (e.target as HTMLInputElement).style.borderColor = '#667eea';
                                    (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.15)';
                                    (e.target as HTMLInputElement).style.transform = 'scale(1.02)';
                                }}
                                onBlur={(e) => {
                                    (e.target as HTMLInputElement).style.borderColor = '#e1e5e9';
                                    (e.target as HTMLInputElement).style.boxShadow = 'none';
                                    (e.target as HTMLInputElement).style.transform = 'scale(1)';
                                }}
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            style={primaryButtonStyle}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)';
                                    (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                    (e.target as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    (e.target as HTMLButtonElement).style.background = '#667eea';
                                    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                                    (e.target as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <span style={loadingSpinnerStyle}></span>
                                    Giriş yapılıyor...
                                </>
                            ) : (
                                '🚀 Giriş Yap'
                            )}
                        </button>

                        <div style={dividerStyle}>
                            <div style={dividerLineStyle}></div>
                            <span style={dividerTextStyle}>veya</span>
                        </div>

                        <button
                            type="button"
                            onClick={goToRegister}
                            style={secondaryButtonStyle}
                            onMouseEnter={(e) => {
                                (e.target as HTMLButtonElement).style.backgroundColor = '#667eea';
                                (e.target as HTMLButtonElement).style.color = 'white';
                                (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                (e.target as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                                (e.target as HTMLButtonElement).style.color = '#667eea';
                                (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                                (e.target as HTMLButtonElement).style.boxShadow = 'none';
                            }}
                        >
                            ✨ Yeni Hesap Oluştur
                        </button>
                    </form>

                    <div style={{
                        textAlign: 'center',
                        marginTop: '25px',
                        color: '#95a5a6',
                        fontSize: '13px',
                        lineHeight: '1.6'
                    }}>
                        Giriş yapmakta sorun mu yaşıyorsunuz?
                        <br />
                        <a href="/help" style={{
                            color: '#667eea',
                            textDecoration: 'none',
                            fontWeight: '600',
                        }}>
                            Yardım alın
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;