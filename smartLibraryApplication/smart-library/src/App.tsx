import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext'; // ✅ Context import edildi

const App: React.FC = () => {
    return (
        <AuthProvider> {/* 🔒 Tüm uygulama artık AuthContext'e erişebilir */}
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
