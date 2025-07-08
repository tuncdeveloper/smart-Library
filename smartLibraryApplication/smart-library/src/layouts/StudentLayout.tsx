import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const StudentLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { path: '/student', label: 'Bilgilerim' },
        { path: '/books', label: 'Kitaplar' },
        { path: '/favorites', label: 'Favorilerim' },
        { path: '/user-information', label: 'Bilgileri Güncelle' },
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    return (
        <div style={{
            fontFamily: 'Poppins, sans-serif',
            minHeight: '100vh',
            background: 'linear-gradient(to right, #f0f4f8, #ffffff)'
        }}>
            {/* Sekme Menüsü */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 25,
                padding: '20px 0',
                background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12
            }}>
                {tabs.map(tab => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <button
                            key={tab.path}
                            onClick={() => handleNavigate(tab.path)}
                            style={{
                                ...tabButtonStyle,
                                background: isActive
                                    ? 'linear-gradient(to right, #facc15, #f97316)'
                                    : 'rgba(255,255,255,0.15)',
                                color: isActive ? '#1f2937' : '#f9fafb',
                                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                fontWeight: isActive ? 'bold' : 'normal',
                                boxShadow: isActive ? '0 4px 8px rgba(0,0,0,0.2)' : 'none'
                            }}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* İçerik Alanı */}
            <div style={{
                padding: 40,
                animation: 'fadeIn 0.5s ease-in-out'
            }}>
                <Outlet />
            </div>
        </div>
    );
};

// Animasyonlu Sekme Stili
const tabButtonStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: 20,
    padding: '10px 22px',
    fontSize: 15,
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    backdropFilter: 'blur(6px)',
};

export default StudentLayout;
