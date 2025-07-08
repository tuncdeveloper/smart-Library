import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    getBookById,
    rateBook,
    getAverageRating,
    getUserRating,
    commentBook,
    getBookComments
} from '../features/book/BookService';
import { BookDetailDTO, BookRatingResponseDTO, BookRatingRequestDTO } from '../types/book';

const BookDetailPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isLoading: authLoading } = useAuth();

    const [book, setBook] = useState<BookDetailDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [userRating, setUserRating] = useState<number | null>(null);
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [ratingLoading, setRatingLoading] = useState(false);

    const [comments, setComments] = useState<BookRatingResponseDTO[]>([]);
    const [commentText, setCommentText] = useState<string>('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [userComment, setUserComment] = useState<BookRatingResponseDTO | null>(null);
    const [isEditingComment, setIsEditingComment] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                if (!id) {
                    throw new Error('Kitap ID\'si bulunamadı');
                }

                const data = await getBookById(Number(id));
                setBook(data);

                const avg = await getAverageRating(Number(id));
                setAverageRating(avg);

                if (user && user.id) {
                    const userRate = await getUserRating(Number(id), user.id);
                    setUserRating(userRate);
                }

            } catch (err) {
                console.error('Kitap yüklenirken hata:', err);
                setError('Kitap bilgisi alınamadı: ' + (err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id, user?.id]);

    useEffect(() => {
        const fetchComments = async () => {
            if (!id) return;

            setCommentsLoading(true);
            try {
                const commentsData = await getBookComments(Number(id));
                setComments(commentsData);

                if (user && user.id) {
                    const userCommentData = commentsData.find(comment => comment.studentId === user.id);
                    setUserComment(userCommentData || null);

                    if (userCommentData && userCommentData.comment) {
                        setCommentText(userCommentData.comment);
                    }
                }

            } catch (err) {
                console.error('Yorumlar yüklenirken hata:', err);
            } finally {
                setCommentsLoading(false);
            }
        };

        fetchComments();
    }, [id, user?.id]);

    const handleRatingChange = async (newRating: number) => {
        if (!id || !user || !user.id) {
            alert('Puan vermek için giriş yapmalısınız.');
            return;
        }

        setRatingLoading(true);
        try {
            await rateBook({
                bookId: Number(id),
                studentId: user.id,
                rating: newRating
            });

            setUserRating(newRating);

            const avg = await getAverageRating(Number(id));
            setAverageRating(avg);

            if (userComment) {
                setComments(prev =>
                    prev.map(comment =>
                        comment.studentId === user.id
                            ? { ...comment, rating: newRating }
                            : comment
                    )
                );
                setUserComment(prev => prev ? { ...prev, rating: newRating } : null);
            }

        } catch (error) {
            console.error('Puan verme hatası:', error);
            alert('Puan verme işlemi sırasında hata oluştu: ' + (error as Error).message);
        } finally {
            setRatingLoading(false);
        }
    };

    const handleCommentSubmit = async () => {
        if (!id || !user || !user.id) {
            alert('Yorum yapmak için giriş yapmalısınız.');
            return;
        }

        if (!userRating || userRating === 0) {
            alert('Yorum yapmak için önce kitaba puan vermelisiniz.');
            return;
        }

        if (!commentText.trim()) {
            alert('Lütfen yorum metnini giriniz.');
            return;
        }

        setCommentLoading(true);
        try {
            const commentData: BookRatingRequestDTO = {
                bookId: Number(id),
                studentId: user.id,
                comment: commentText.trim(),
                rating: userRating
            };

            const newComment = await commentBook(commentData);

            if (userComment) {
                setComments(prev =>
                    prev.map(comment =>
                        comment.studentId === user.id
                            ? { ...newComment, rating: userRating, studentUsername: user.username }
                            : comment
                    )
                );
                setUserComment({ ...newComment, rating: userRating, studentUsername: user.username });
            } else {
                const commentWithRating = {
                    ...newComment,
                    rating: userRating,
                    studentUsername: user.username
                };
                setComments(prev => [commentWithRating, ...prev]);
                setUserComment(commentWithRating);
            }

            setIsEditingComment(false);
        } catch (error) {
            console.error('Yorum işleme hatası:', error);
            alert('Yorum işlemi sırasında hata oluştu: ' + (error as Error).message);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleEditComment = () => {
        setIsEditingComment(true);
        if (userComment && userComment.comment) {
            setCommentText(userComment.comment);
        }
    };

    const handleCancelEdit = () => {
        setIsEditingComment(false);
        if (userComment && userComment.comment) {
            setCommentText(userComment.comment);
        } else {
            setCommentText('');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getUserDisplayName = (comment: BookRatingResponseDTO) => {
        if (comment.studentUsername) {
            return comment.studentUsername;
        }

        if (user && comment.studentId === user.id) {
            return user.username || 'Sen';
        }

        return `Kullanıcı #${comment.studentId}`;
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

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.6;
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

    const bookCoverStyle = {
        width: '100%',
        height: '400px',
        borderRadius: '16px',
        objectFit: 'cover',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
        marginBottom: '30px',
        animation: 'fadeInUp 0.8s ease-out',
    };

    const placeholderCoverStyle = {
        ...bookCoverStyle,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
    };

    const bookInfoStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '40px',
        animation: 'slideIn 0.5s ease-out',
    };

    const infoItemStyle = {
        padding: '15px',
        borderRadius: '12px',
        background: 'rgba(102, 126, 234, 0.08)',
        border: '1px solid rgba(102, 126, 234, 0.15)',
    };

    const infoLabelStyle = {
        fontSize: '14px',
        fontWeight: '600',
        color: '#667eea',
        marginBottom: '5px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    const infoValueStyle = {
        fontSize: '16px',
        fontWeight: '500',
        color: '#2c3e50',
    };

    const descriptionStyle = {
        padding: '25px',
        background: 'rgba(102, 126, 234, 0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(102, 126, 234, 0.1)',
        marginBottom: '40px',
        lineHeight: '1.7',
        color: '#2c3e50',
        animation: 'slideIn 0.5s ease-out 0.1s both',
    };

    const sectionTitleStyle = {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: '25px',
        paddingBottom: '10px',
        borderBottom: '2px solid rgba(102, 126, 234, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    };

    const ratingContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '25px',
        background: 'rgba(102, 126, 234, 0.08)',
        borderRadius: '16px',
        border: '1px solid rgba(102, 126, 234, 0.15)',
        animation: 'slideIn 0.5s ease-out 0.2s both',
    };

    const ratingBoxStyle = {
        textAlign: 'center' as const,
    };

    const ratingValueStyle = {
        fontSize: '42px',
        fontWeight: '800',
        color: '#667eea',
        marginBottom: '5px',
    };

    const ratingTextStyle = {
        fontSize: '14px',
        fontWeight: '600',
        color: '#7f8c8d',
    };

    const starContainerStyle = {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
    };

    const starRatingStyle = {
        display: 'flex',
        gap: '5px',
        marginBottom: '15px',
    };

    const starStyle = (active: boolean) => ({
        fontSize: '32px',
        color: active ? '#ffc107' : '#e0e0e0',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    });

    const commentInputStyle = {
        padding: '25px',
        background: 'rgba(102, 126, 234, 0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(102, 126, 234, 0.1)',
        marginBottom: '40px',
        animation: 'slideIn 0.5s ease-out 0.3s both',
    };

    const textareaStyle = {
        width: '100%',
        padding: '15px',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        borderRadius: '12px',
        fontSize: '16px',
        minHeight: '120px',
        marginBottom: '15px',
        resize: 'vertical' as const,
        transition: 'all 0.3s ease',
    };

    const buttonStyle = {
        padding: '12px 25px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
    };

    const secondaryButtonStyle = {
        ...buttonStyle,
        background: '#95a5a6',
        marginLeft: '10px',
    };

    const commentCardStyle = {
        padding: '20px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
        marginBottom: '20px',
        border: '1px solid rgba(102, 126, 234, 0.1)',
        animation: 'fadeInUp 0.5s ease-out',
    };

    const commentHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
    };

    const commentUserStyle = {
        fontWeight: '700',
        color: '#2c3e50',
    };

    const commentDateStyle = {
        fontSize: '14px',
        color: '#95a5a6',
    };

    const commentRatingStyle = {
        display: 'flex',
        gap: '3px',
        marginBottom: '10px',
    };

    const commentContentStyle = {
        lineHeight: '1.6',
        color: '#2c3e50',
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

    if (authLoading || loading) {
        return (
            <>
                <style>{keyframes}</style>
                <div style={containerStyle}>
                    <div style={contentStyle}>
                        <div style={loadingStyle}>
                            <span style={loadingSpinnerStyle}></span>
                            Kitap bilgileri yükleniyor...
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error || !book) {
        return (
            <>
                <style>{keyframes}</style>
                <div style={containerStyle}>
                    <div style={contentStyle}>
                        <div style={errorStyle}>
                            ⚠️ {error ?? 'Kitap bulunamadı'}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button
                                onClick={() => navigate('/books')}
                                style={{
                                    ...buttonStyle,
                                    backgroundColor: '#667eea',
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                    fontSize: '18px',
                                    padding: '16px 32px',
                                }}
                            >
                                📚 Kitaplara Dön
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
                    <button
                        onClick={() => navigate('/books')}
                        style={{
                            ...buttonStyle,
                            backgroundColor: '#667eea',
                            marginBottom: '20px',
                        }}
                    >
                        ← Geri Dön
                    </button>

                    <h1 style={titleStyle}>
                        <span>📖</span>
                        {book.title}
                    </h1>



                    <div style={bookInfoStyle}>
                        <div style={infoItemStyle}>
                            <div style={infoLabelStyle}>
                                <span>✍️</span>
                                Yazar
                            </div>
                            <div style={infoValueStyle}>{book.author}</div>
                        </div>
                        <div style={infoItemStyle}>
                            <div style={infoLabelStyle}>
                                <span>🏢</span>
                                Yayınevi
                            </div>
                            <div style={infoValueStyle}>{book.publisher}</div>
                        </div>
                        <div style={infoItemStyle}>
                            <div style={infoLabelStyle}>
                                <span>📅</span>
                                Yayın Yılı
                            </div>
                            <div style={infoValueStyle}>{book.publicationYear}</div>
                        </div>
                        <div style={infoItemStyle}>
                            <div style={infoLabelStyle}>
                                <span>📚</span>
                                Kategori
                            </div>
                            <div style={infoValueStyle}>{book.category}</div>
                        </div>
                        <div style={infoItemStyle}>
                            <div style={infoLabelStyle}>
                                <span>📃</span>
                                Sayfa Sayısı
                            </div>
                            <div style={infoValueStyle}>{book.pageCount}</div>
                        </div>
                        <div style={infoItemStyle}>
                            <div style={infoLabelStyle}>
                                <span>🌐</span>
                                Dil
                            </div>
                            <div style={infoValueStyle}>{book.language}</div>
                        </div>
                    </div>

                    <div style={descriptionStyle}>
                        <h3 style={{
                            marginTop: '0',
                            marginBottom: '15px',
                            color: '#667eea',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <span>📝</span>
                            Açıklama
                        </h3>
                        <p>{book.description}</p>
                    </div>

                    <div style={ratingContainerStyle}>
                        <div style={ratingBoxStyle}>
                            <div style={ratingValueStyle}>
                                {averageRating?.toFixed(1) ?? '0.0'}
                                <span style={{ fontSize: '20px', color: '#95a5a6' }}>/5</span>
                            </div>
                            <div style={ratingTextStyle}>Ortalama Puan</div>
                        </div>

                        <div style={starContainerStyle}>
                            <div style={ratingTextStyle}>
                                {user ? (userRating ? 'Puanınız' : 'Puan Verin') : 'Puan vermek için giriş yapın'}
                            </div>
                            <div style={starRatingStyle}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        onClick={() => user && handleRatingChange(star)}
                                        style={starStyle(!!userRating && star <= userRating)}
                                        title={`${star} yıldız`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            {ratingLoading && (
                                <div style={{ color: '#667eea', fontSize: '14px' }}>
                                    <span style={loadingSpinnerStyle}></span> Kaydediliyor...
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 style={sectionTitleStyle}>
                            <span>💬</span>
                            Yorumlar
                            <span style={{
                                fontSize: '16px',
                                fontWeight: 'normal',
                                color: '#95a5a6',
                                marginLeft: '10px'
                            }}>
                                ({comments.length})
                            </span>
                        </h3>

                        {user ? (
                            <div style={commentInputStyle}>
                                <h4 style={{ marginTop: '0', marginBottom: '15px', color: '#2c3e50' }}>
                                    {userComment && !isEditingComment ? 'Yorumunuz' : 'Yorum Yapın'}
                                </h4>

                                {(!userRating || userRating === 0) && (
                                    <div style={{
                                        backgroundColor: '#fff3cd',
                                        borderLeft: '4px solid #ffc107',
                                        padding: '12px',
                                        marginBottom: '15px',
                                        borderRadius: '4px',
                                        color: '#856404'
                                    }}>
                                        <strong>Dikkat:</strong> Yorum yapmak için önce kitaba puan vermelisiniz.
                                    </div>
                                )}

                                {userComment && !isEditingComment ? (
                                    <div style={{
                                        padding: '15px',
                                        background: '#f8f9ff',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(102, 126, 234, 0.2)',
                                        marginBottom: '15px',
                                    }}>
                                        <div style={commentHeaderStyle}>
                                            <div style={commentUserStyle}>Sen</div>
                                            <div style={commentDateStyle}>
                                                {userComment.createdAt && formatDate(userComment.createdAt)}
                                            </div>
                                        </div>
                                        {userComment.rating > 0 && (
                                            <div style={commentRatingStyle}>
                                                {[...Array(5)].map((_, i) => (
                                                    <span
                                                        key={i}
                                                        style={{
                                                            color: i < userComment.rating ? '#ffc107' : '#e0e0e0',
                                                            fontSize: '18px'
                                                        }}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <p style={commentContentStyle}>
                                            {userComment.comment}
                                        </p>
                                        <button
                                            onClick={handleEditComment}
                                            style={{
                                                ...buttonStyle,
                                                backgroundColor: '#ffc107',
                                                color: '#000',
                                                padding: '8px 16px',
                                                fontSize: '14px',
                                            }}
                                        >
                                            ✏️ Düzenle
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <textarea
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Kitap hakkında yorumunuzu yazın..."
                                            style={{
                                                ...textareaStyle,
                                                borderColor: commentText ? '#667eea' : 'rgba(102, 126, 234, 0.2)',
                                            }}
                                            disabled={commentLoading || (!userRating || userRating === 0)}
                                        />
                                        <div>
                                            <button
                                                onClick={handleCommentSubmit}
                                                disabled={commentLoading || !commentText.trim() || (!userRating || userRating === 0)}
                                                style={{
                                                    ...buttonStyle,
                                                    backgroundColor: (commentLoading || !commentText.trim() || (!userRating || userRating === 0)) ? '#95a5a6' : '#667eea',
                                                    cursor: (commentLoading || !commentText.trim() || (!userRating || userRating === 0)) ? 'not-allowed' : 'pointer',
                                                }}
                                            >
                                                {commentLoading ? 'Gönderiliyor...' : (userComment ? 'Güncelle' : 'Yorum Gönder')}
                                            </button>
                                            {isEditingComment && (
                                                <button
                                                    onClick={handleCancelEdit}
                                                    disabled={commentLoading}
                                                    style={secondaryButtonStyle}
                                                >
                                                    İptal
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div style={{
                                padding: '20px',
                                background: 'rgba(102, 126, 234, 0.05)',
                                borderRadius: '16px',
                                border: '1px dashed rgba(102, 126, 234, 0.3)',
                                textAlign: 'center',
                                marginBottom: '30px',
                                color: '#667eea',
                                fontWeight: '500',
                            }}>
                                <p>Yorum yapmak için giriş yapmalısınız</p>
                                <button
                                    onClick={() => navigate('/login')}
                                    style={{
                                        ...buttonStyle,
                                        marginTop: '10px',
                                        backgroundColor: '#27ae60',
                                    }}
                                >
                                    🚀 Giriş Yap
                                </button>
                            </div>
                        )}

                        {commentsLoading ? (
                            <div style={loadingStyle}>
                                <span style={loadingSpinnerStyle}></span>
                                Yorumlar yükleniyor...
                            </div>
                        ) : comments.length === 0 ? (
                            <div style={{
                                padding: '40px 20px',
                                textAlign: 'center',
                                background: 'rgba(127, 140, 141, 0.1)',
                                borderRadius: '16px',
                                border: '2px dashed rgba(127, 140, 141, 0.3)',
                                color: '#7f8c8d',
                            }}>
                                <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>💬</span>
                                Henüz yorum yapılmamış
                            </div>
                        ) : (
                            <div>
                                {comments.map((comment, index) => (
                                    <div
                                        key={comment.id}
                                        style={{
                                            ...commentCardStyle,
                                            animationDelay: `${index * 0.05}s`,
                                        }}
                                    >
                                        <div style={commentHeaderStyle}>
                                            <div style={commentUserStyle}>
                                                {getUserDisplayName(comment)}
                                            </div>
                                            <div style={commentDateStyle}>
                                                {comment.createdAt && formatDate(comment.createdAt)}
                                            </div>
                                        </div>
                                        {comment.rating > 0 && (
                                            <div style={commentRatingStyle}>
                                                {[...Array(5)].map((_, i) => (
                                                    <span
                                                        key={i}
                                                        style={{
                                                            color: i < comment.rating ? '#ffc107' : '#e0e0e0',
                                                        }}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <p style={commentContentStyle}>
                                            {comment.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookDetailPage;