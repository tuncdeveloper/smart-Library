import React from 'react';
import { useLocation } from 'react-router-dom';

interface Student {
    username: string;
    email: string;
    fullName: string;
    studentNumber: string;
    phone: string;
}

const StudentPage: React.FC = () => {
    const location = useLocation();
    const student: Student = location.state || JSON.parse(localStorage.getItem('student')!);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 20px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            <div style={{
                width: '80%',
                maxWidth: 700,
                backgroundColor: '#fff',
                padding: '50px 60px',
                borderRadius: 20,
                boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                textAlign: 'center',
                color: '#333'
            }}>
                <h2 style={{
                    fontSize: '36px',
                    marginBottom: 30,
                    fontWeight: '700',
                    position: 'relative',
                    display: 'inline-block',
                    paddingBottom: 10,
                    borderBottom: '3px solid #764ba2',
                    color: '#4b2c91'
                }}>
                    Hoşgeldiniz {student.fullName}
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: 20, textAlign: 'left' }}>
                    {[
                        { label: "Kullanıcı Adı", value: student.username },
                        { label: "Email", value: student.email },
                        { label: "Telefon", value: student.phone },

                    ].map((item) => (
                        <li
                            key={item.label}
                            style={{
                                marginBottom: 18,
                                fontSize: '18px',
                                paddingLeft: 30,
                                position: 'relative',
                                cursor: 'default',
                                transition: 'color 0.3s ease',
                                color: '#555',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#764ba2'}
                            onMouseLeave={e => e.currentTarget.style.color = '#555'}
                        >
                            <span style={{
                                position: 'absolute',
                                left: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 20,
                                height: 20,
                                backgroundColor: '#764ba2',
                                borderRadius: '50%',
                                display: 'inline-block',
                            }}></span>
                            <strong>{item.label}:</strong> {item.value}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default StudentPage;
