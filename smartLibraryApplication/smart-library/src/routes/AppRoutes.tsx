// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

import StudentLayout from '../layouts/StudentLayout'; // Sekmeli layout bileşeni

import StudentPage from '../pages/StudentPage';
import StudentInformation from '../pages/StudentInformation';
import BookListPage from '../pages/BookListPage';
import BookDetailPage from '../pages/BookDetailPage';
import BookFavoritePage from '../pages/BookFavoritePage';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Giriş ve Kayıt sekmesizdir */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Login sonrası sekmeli layout altında tanımlanır */}
            <Route element={<StudentLayout />}>
                <Route path="/student" element={<StudentPage />} />
                <Route path="/user-information" element={<StudentInformation />} />
                <Route path="/books" element={<BookListPage />} />
                <Route path="/books/:id" element={<BookDetailPage />} />
                <Route path="/favorites" element={<BookFavoritePage />} />
            </Route>

            {/* Tanımsız rota olursa login sayfasına yönlendir */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
