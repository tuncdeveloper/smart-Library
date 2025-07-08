import React, { useEffect, useState } from 'react';
import {
    getAllBooks,
    getBooksByCategory,
    searchBooksByTitle,
    addFavoriteBook,
    removeFavoriteBook,
    getFavoriteBooksByStudentId
} from '../features/book/BookService';
import { BookListDTO, BookFavoriteDTO } from '../types/book';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const categories = [
    "Tümü",
    "Psikolojik",
    "Aşk",
    "Tarihi Roman",
    "Macera",
    "Toplumcu Gerçekçi",
    "Felsefi Roman",
    "Bilim Kurgu (Sci-Fi)",
    "Siyasi Alegori",
    "Fantastik",
    "Varoluşçu",
    "Modern",
    "Toplumsal Roman",
    "Dram"
];

const BookSearchWithCategory: React.FC = () => {
    const { user } = useAuth();
    const studentId = user?.id;

    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tümü');
    const [books, setBooks] = useState<BookListDTO[]>([]);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    // Favorileri yükle - component mount olduğunda ve studentId değiştiğinde
    useEffect(() => {
        if (studentId) {
            fetchFavorites();
        }
    }, [studentId]);

    // Kitapları yükle - searchText veya selectedCategory değiştiğinde
    useEffect(() => {
        fetchBooks();
    }, [searchText, selectedCategory]);

    // Kitaplar yüklendikten sonra favorileri de yükle
    useEffect(() => {
        if (studentId && books.length > 0) {
            fetchFavorites();
        }
    }, [books, studentId]);

    // Sayfa visibility change olduğunda favorileri yeniden yükle
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && studentId) {
                fetchFavorites();
            }
        };

        const handleFocus = () => {
            if (studentId) {
                fetchFavorites();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [studentId]);

    const fetchFavorites = async () => {
        if (!studentId) return;

        try {
            console.log('Favoriler yükleniyor, studentId:', studentId);
            const favBooks: BookFavoriteDTO[] = await getFavoriteBooksByStudentId(studentId);
            console.log('Yüklenen favoriler:', favBooks);
            const favIds = new Set(favBooks.map(fav => fav.bookId));
            console.log('Favori ID\'leri:', Array.from(favIds));
            setFavorites(favIds);
        } catch (e) {
            console.error('Favoriler yüklenirken hata:', e);
        }
    };

    const fetchBooks = async () => {
        setLoading(true);
        setError(null);

        try {
            let data: BookListDTO[] = [];

            if (searchText.trim()) {
                data = await searchBooksByTitle(searchText);
            } else if (selectedCategory !== 'Tümü') {
                data = await getBooksByCategory(selectedCategory);
            } else {
                data = await getAllBooks();
            }

            setBooks(data);
        } catch (e) {
            setError('Kitaplar yüklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (bookId: number) => {
        if (!studentId) {
            alert('Lütfen giriş yapınız.');
            return;
        }

        const isFavorite = favorites.has(bookId);

        try {
            if (isFavorite) {
                await removeFavoriteBook(studentId, bookId);
                setFavorites(prev => {
                    const copy = new Set(prev);
                    copy.delete(bookId);
                    return copy;
                });
            } else {
                await addFavoriteBook(studentId, bookId);
                setFavorites(prev => {
                    const copy = new Set(prev);
                    copy.add(bookId);
                    return copy;
                });
            }
        } catch (e) {
            console.error('Favori işlemi başarısız:', e);
            // Hata durumunda favorileri yeniden yükle
            await fetchFavorites();
        }
    };

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

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
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
    `;

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    };

    const contentStyle = {
        maxWidth: '1200px',
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
    };

    const searchContainerStyle = {
        display: 'flex',
        gap: '15px',
        marginBottom: '35px',
        alignItems: 'center',
        flexWrap: 'wrap' as const,
    };

    const inputStyle = {
        flex: '2',
        minWidth: '250px',
        padding: '14px 18px',
        border: '2px solid #e1e5e9',
        borderRadius: '10px',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        outline: 'none',
        backgroundColor: '#fff',
        boxSizing: 'border-box' as const,
    };

    const selectStyle = {
        flex: '1',
        minWidth: '200px',
        padding: '14px 18px',
        border: '2px solid #e1e5e9',
        borderRadius: '10px',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
        outline: 'none',
        backgroundColor: '#fff',
        cursor: 'pointer',
        boxSizing: 'border-box' as const,
    };

    const loadingStyle = {
        textAlign: 'center' as const,
        padding: '40px',
        color: '#667eea',
        fontSize: '18px',
        fontWeight: '500',
    };

    const errorStyle = {
        textAlign: 'center' as const,
        padding: '20px',
        color: '#e74c3c',
        fontSize: '16px',
        fontWeight: '500',
        background: 'rgba(231, 76, 60, 0.1)',
        borderRadius: '10px',
        marginBottom: '20px',
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse' as const,
        backgroundColor: '#fff',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    };

    const headerStyle = {
        backgroundColor: '#667eea',
        color: 'white',
        fontWeight: '600',
        fontSize: '16px',
        padding: '18px 20px',
        textAlign: 'left' as const,
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    };

    const cellStyle = {
        padding: '18px 20px',
        borderBottom: '1px solid #f0f0f0',
        fontSize: '15px',
        color: '#2c3e50',
        transition: 'all 0.3s ease',
    };

    const clickableCellStyle = {
        ...cellStyle,
        cursor: 'pointer',
        fontWeight: '500',
        color: '#667eea',
    };

    const favoriteButtonStyle = (isFavorite: boolean) => ({
        padding: '8px 16px',
        backgroundColor: isFavorite ? '#e74c3c' : '#27ae60',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: `0 4px 15px ${isFavorite ? 'rgba(231, 76, 60, 0.3)' : 'rgba(39, 174, 96, 0.3)'}`,
    });

    const noResultsStyle = {
        textAlign: 'center' as const,
        padding: '60px 20px',
        color: '#7f8c8d',
        fontSize: '18px',
        fontWeight: '500',
    };

    const ratingStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 8px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        fontWeight: '500',
        color: '#667eea',
    };

    const loadingSpinnerStyle = {
        display: 'inline-block',
        width: '20px',
        height: '20px',
        border: '3px solid #667eea',
        borderRadius: '50%',
        borderTopColor: 'transparent',
        animation: 'spin 1s ease-in-out infinite',
        marginRight: '10px',
    };

    return (
        <>
            <style>{keyframes}</style>
            <div style={containerStyle}>
                <div style={contentStyle}>
                    <h1 style={titleStyle}>📚 Kitap Arama ve Listeleme</h1>

                    <div style={searchContainerStyle}>
                        <input
                            type="text"
                            placeholder="🔍 Kitap ismine göre ara..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={inputStyle}
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

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={selectStyle}
                            onFocus={(e) => {
                                (e.target as HTMLSelectElement).style.borderColor = '#667eea';
                                (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.15)';
                            }}
                            onBlur={(e) => {
                                (e.target as HTMLSelectElement).style.borderColor = '#e1e5e9';
                                (e.target as HTMLSelectElement).style.boxShadow = 'none';
                            }}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === 'Tümü' ? '📖 ' + cat : '📚 ' + cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {loading && (
                        <div style={loadingStyle}>
                            <span style={loadingSpinnerStyle}></span>
                            Kitaplar yükleniyor...
                        </div>
                    )}

                    {error && <div style={errorStyle}>⚠️ {error}</div>}

                    {!loading && !error && (
                        <div style={{ overflowX: 'auto', borderRadius: '15px' }}>
                            <table style={tableStyle}>
                                <thead>
                                <tr>
                                    <th style={headerStyle}>📖 Başlık</th>
                                    <th style={headerStyle}>✍️ Yazar</th>
                                    <th style={headerStyle}>📂 Kategori</th>
                                    <th style={headerStyle}>⭐ Puan</th>
                                    <th style={headerStyle}>❤️ Favori</th>
                                </tr>
                                </thead>
                                <tbody>
                                {books.length ? (
                                    books.map((book, index) => (
                                        <tr
                                            key={book.id}
                                            style={{
                                                animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#f8f9ff';
                                                (e.currentTarget as HTMLTableRowElement).style.transform = 'scale(1.01)';
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
                                                (e.currentTarget as HTMLTableRowElement).style.transform = 'scale(1)';
                                            }}
                                        >
                                            <td
                                                style={clickableCellStyle}
                                                onClick={() => navigate(`/books/${book.id}`)}
                                                onMouseEnter={(e) => {
                                                    (e.target as HTMLTableCellElement).style.color = '#764ba2';
                                                    (e.target as HTMLTableCellElement).style.textDecoration = 'underline';
                                                }}
                                                onMouseLeave={(e) => {
                                                    (e.target as HTMLTableCellElement).style.color = '#667eea';
                                                    (e.target as HTMLTableCellElement).style.textDecoration = 'none';
                                                }}
                                            >
                                                {book.title}
                                            </td>
                                            <td style={cellStyle}>{book.author}</td>
                                            <td style={cellStyle}>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        padding: '4px 8px',
                                                        backgroundColor: '#e8f4f8',
                                                        borderRadius: '6px',
                                                        fontSize: '13px',
                                                        fontWeight: '500',
                                                        color: '#2c3e50',
                                                    }}>
                                                        {book.category}
                                                    </span>
                                            </td>
                                            <td style={cellStyle}>
                                                    <span style={ratingStyle}>
                                                        ⭐ {book.averageRating}
                                                    </span>
                                            </td>
                                            <td style={cellStyle}>
                                                <button
                                                    onClick={() => toggleFavorite(book.id)}
                                                    style={favoriteButtonStyle(favorites.has(book.id))}
                                                    onMouseEnter={(e) => {
                                                        (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                                        (e.target as HTMLButtonElement).style.boxShadow = favorites.has(book.id)
                                                            ? '0 6px 20px rgba(231, 76, 60, 0.5)'
                                                            : '0 6px 20px rgba(39, 174, 96, 0.5)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                                                        (e.target as HTMLButtonElement).style.boxShadow = favorites.has(book.id)
                                                            ? '0 4px 15px rgba(231, 76, 60, 0.3)'
                                                            : '0 4px 15px rgba(39, 174, 96, 0.3)';
                                                    }}
                                                >
                                                    {favorites.has(book.id) ? '💔 Favorilerden Çıkar' : '❤️ Favoriye Ekle'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={noResultsStyle}>
                                            📚 Aradığınız kriterlere uygun kitap bulunamadı.
                                            <br />
                                            <small style={{ color: '#95a5a6', marginTop: '10px', display: 'block' }}>
                                                Farklı bir arama terimi veya kategori deneyin.
                                            </small>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BookSearchWithCategory;