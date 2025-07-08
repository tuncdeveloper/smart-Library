import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getFavoriteBooksByStudentId } from '../features/book/BookService';
import { BookFavoriteDTO } from '../types/book';

const BookFavoritePage: React.FC = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [favoriteBooks, setFavoriteBooks] = useState<BookFavoriteDTO[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchFavorites = async () => {
            try {
                const data = await getFavoriteBooksByStudentId(user.id);
                setFavoriteBooks(data);
            } catch {
                setError('Favori kitaplar yüklenirken hata oluştu.');
            }
        };

        fetchFavorites();
    }, [user]);

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

        @keyframes slideIn {
            from {
                transform: translateX(-20px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes heartBeat {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }

        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }
    `;

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    };

    const contentStyle = {
        maxWidth: '900px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        borderRadius: '24px',
        padding: '45px',
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    };

    const heartStyle = {
        animation: 'heartBeat 2s ease-in-out infinite',
        fontSize: '36px',
    };

    const loadingStyle = {
        textAlign: 'center' as const,
        padding: '60px 20px',
        color: '#667eea',
        fontSize: '18px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    };

    const loadingSpinnerStyle = {
        display: 'inline-block',
        width: '24px',
        height: '24px',
        border: '3px solid #667eea',
        borderRadius: '50%',
        borderTopColor: 'transparent',
        animation: 'spin 1s ease-in-out infinite',
    };

    const errorStyle = {
        textAlign: 'center' as const,
        padding: '40px 20px',
        color: '#e74c3c',
        fontSize: '18px',
        fontWeight: '500',
        background: 'rgba(231, 76, 60, 0.1)',
        borderRadius: '15px',
        border: '2px solid rgba(231, 76, 60, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    };

    const emptyStateStyle = {
        textAlign: 'center' as const,
        padding: '80px 20px',
        color: '#7f8c8d',
        fontSize: '18px',
        fontWeight: '500',
        background: 'rgba(127, 140, 141, 0.1)',
        borderRadius: '15px',
        border: '2px dashed rgba(127, 140, 141, 0.3)',
    };

    const emptyIconStyle = {
        fontSize: '64px',
        marginBottom: '20px',
        animation: 'float 3s ease-in-out infinite',
        display: 'block',
    };

    const backButtonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textDecoration: 'none',
        marginBottom: '20px',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    };

    const bookGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    };

    const bookCardStyle = {
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        borderRadius: '16px',
        padding: '25px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(102, 126, 234, 0.1)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
        position: 'relative' as const,
        overflow: 'hidden',
    };

    const bookTitleStyle = {
        fontSize: '20px',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '12px',
        lineHeight: '1.4',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    const bookInfoStyle = {
        fontSize: '15px',
        color: '#7f8c8d',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    const categoryBadgeStyle = {
        display: 'inline-block',
        padding: '4px 12px',
        backgroundColor: '#e8f4f8',
        color: '#2c3e50',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '500',
        marginTop: '10px',
    };

    const shimmerStyle = {
        position: 'absolute' as const,
        top: '0',
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
        transition: 'left 0.5s ease',
    };

    const statsStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        margin: '20px 0',
        padding: '20px',
        background: 'rgba(102, 126, 234, 0.1)',
        borderRadius: '15px',
        border: '1px solid rgba(102, 126, 234, 0.2)',
    };

    const statItemStyle = {
        textAlign: 'center' as const,
        color: '#667eea',
        fontWeight: '600',
    };

    const statNumberStyle = {
        fontSize: '28px',
        fontWeight: '700',
        display: 'block',
        marginBottom: '5px',
    };

    if (isLoading) {
        return (
            <>
                <style>{keyframes}</style>
                <div style={containerStyle}>
                    <div style={contentStyle}>
                        <div style={loadingStyle}>
                            <span style={loadingSpinnerStyle}></span>
                            Favorileriniz yükleniyor...
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!user) {
        return (
            <>
                <style>{keyframes}</style>
                <div style={containerStyle}>
                    <div style={contentStyle}>
                        <div style={errorStyle}>
                            🔒 Favori kitaplarınızı görüntülemek için giriş yapmalısınız.
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button
                                onClick={() => navigate('/login')}
                                style={{
                                    ...backButtonStyle,
                                    backgroundColor: '#27ae60',
                                    boxShadow: '0 4px 15px rgba(39, 174, 96, 0.4)',
                                }}
                            >
                                🚀 Giriş Yap
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <style>{keyframes}</style>
                <div style={containerStyle}>
                    <div style={contentStyle}>
                        <div style={errorStyle}>
                            ⚠️ {error}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button
                                onClick={() => window.location.reload()}
                                style={backButtonStyle}
                            >
                                🔄 Yeniden Dene
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (favoriteBooks.length === 0) {
        return (
            <>
                <style>{keyframes}</style>
                <div style={containerStyle}>
                    <div style={contentStyle}>
                        <h1 style={titleStyle}>
                            <span style={heartStyle}>💔</span>
                            Favorilerim
                        </h1>

                        <div style={emptyStateStyle}>
                            <span style={emptyIconStyle}>📚</span>
                            <div style={{ fontSize: '20px', marginBottom: '10px', fontWeight: '600' }}>
                                Henüz favori kitabınız bulunmamaktadır
                            </div>
                            <div style={{ fontSize: '16px', color: '#95a5a6' }}>
                                Kitapları keşfetmek ve favorilerinize eklemek için aşağıdaki butonu kullanabilirsiniz
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                            <button
                                onClick={() => navigate('/books')}
                                style={{
                                    ...backButtonStyle,
                                    backgroundColor: '#27ae60',
                                    boxShadow: '0 4px 15px rgba(39, 174, 96, 0.4)',
                                    fontSize: '18px',
                                    padding: '16px 32px',
                                }}
                                onMouseEnter={(e) => {
                                    (e.target as HTMLButtonElement).style.backgroundColor = '#2ecc71';
                                    (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                    (e.target as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(39, 174, 96, 0.6)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.target as HTMLButtonElement).style.backgroundColor = '#27ae60';
                                    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                                    (e.target as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(39, 174, 96, 0.4)';
                                }}
                            >
                                📖 Kitapları Keşfet
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <style>{keyframes}</style>
            <div style={containerStyle}>
                <div style={contentStyle}>
                    <h1 style={titleStyle}>
                        <span style={heartStyle}>❤️</span>
                        Favorilerim
                    </h1>

                    <div style={statsStyle}>
                        <div style={statItemStyle}>
                            <span style={statNumberStyle}>{favoriteBooks.length}</span>
                            <span>Favori Kitap</span>
                        </div>
                        <div style={statItemStyle}>
                            <span style={statNumberStyle}>
                                {new Set(favoriteBooks.map(book => book.category)).size}
                            </span>
                            <span>Farklı Kategori</span>
                        </div>
                        <div style={statItemStyle}>
                            <span style={statNumberStyle}>
                                {new Set(favoriteBooks.map(book => book.author)).size}
                            </span>
                            <span>Farklı Yazar</span>
                        </div>
                    </div>

                    <div style={bookGridStyle}>
                        {favoriteBooks.map((book, index) => (
                            <div
                                key={book.bookId}
                                onClick={() => navigate(`/books/${book.bookId}`)}
                                style={{
                                    ...bookCardStyle,
                                    animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                                }}
                                onMouseEnter={(e) => {
                                    const target = e.currentTarget as HTMLDivElement;
                                    target.style.transform = 'translateY(-8px) scale(1.02)';
                                    target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.2)';
                                    target.style.borderColor = 'rgba(102, 126, 234, 0.3)';

                                    const shimmer = target.querySelector('.shimmer') as HTMLDivElement;
                                    if (shimmer) {
                                        shimmer.style.left = '100%';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    const target = e.currentTarget as HTMLDivElement;
                                    target.style.transform = 'translateY(0) scale(1)';
                                    target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
                                    target.style.borderColor = 'rgba(102, 126, 234, 0.1)';

                                    const shimmer = target.querySelector('.shimmer') as HTMLDivElement;
                                    if (shimmer) {
                                        shimmer.style.left = '-100%';
                                    }
                                }}
                            >
                                <div className="shimmer" style={shimmerStyle}></div>

                                <div style={bookTitleStyle}>
                                    📖 {book.title}
                                </div>

                                <div style={bookInfoStyle}>
                                    <span>✍️</span>
                                    <strong>Yazar:</strong> {book.author}
                                </div>

                                <div style={bookInfoStyle}>
                                    <span>📂</span>
                                    <strong>Kategori:</strong>
                                    <span style={categoryBadgeStyle}>{book.category}</span>
                                </div>

                                <div style={{
                                    marginTop: '15px',
                                    padding: '10px',
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    color: '#667eea',
                                    fontWeight: '500',
                                }}>
                                    👆 Detayları görüntülemek için tıklayın
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <button
                            onClick={() => navigate('/books')}
                            style={backButtonStyle}
                            onMouseEnter={(e) => {
                                (e.target as HTMLButtonElement).style.backgroundColor = '#5a67d8';
                                (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                (e.target as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLButtonElement).style.backgroundColor = '#667eea';
                                (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                                (e.target as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                            }}
                        >
                            📚 Daha Fazla Kitap Keşfet
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookFavoritePage;