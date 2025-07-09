import axios from 'axios';

axios.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem('student');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.token) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (error) {
                console.error('Token parse hatası:', error);
                localStorage.removeItem('student');
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('student');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axios;