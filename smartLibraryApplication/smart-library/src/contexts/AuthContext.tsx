// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudentLoginResponseDTO } from '../types/student';

interface AuthContextType {
    user: StudentLoginResponseDTO | null;
    login: (user: StudentLoginResponseDTO) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<StudentLoginResponseDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('student');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                console.log('localStorage\'dan kullanıcı yüklendi:', parsedUser);
                setUser(parsedUser);
            }
        } catch (error) {
            console.error('localStorage\'dan kullanıcı yüklenemedi:', error);
            localStorage.removeItem('student'); // Bozuk veriyi temizle
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (userData: StudentLoginResponseDTO) => {
        console.log('Kullanıcı giriş yapıyor:', userData);
        setUser(userData);
        localStorage.setItem('student', JSON.stringify(userData));
    };

    const logout = () => {
        console.log('Kullanıcı çıkış yapıyor');
        setUser(null);
        localStorage.removeItem('student');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};