// src/components/layout/navbar.js - UPDATED
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/button';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };



    const handleLogout = () => {
        navigate('/logout');
    };
    return (
        <header style={styles.header}>
            <nav style={styles.nav}>
                <Link to="/" style={styles.logo}>
                    Trip Planner
                </Link>

                <div style={styles.menuLinks}>
                    <NavLink to="/" style={({isActive}) => (isActive ? styles.activeLink : styles.link)}>Ana Sayfa</NavLink>
                    {isAuthenticated && (
                        <>
                            <NavLink to="/my-trips" style={({isActive}) => (isActive ? styles.activeLink : styles.link)}>Gezilerim</NavLink>
                            {/*<NavLink to="/user-management-test" style={({isActive}) => (isActive ? styles.activeLink : styles.link)}>API Test</NavLink>*/}
                        </>
                    )}
                    <NavLink to="/contact" style={({isActive}) => (isActive ? styles.activeLink : styles.link)}>İletişim</NavLink>
                </div>

                <div style={styles.authButtons}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" style={styles.profileLink}>Profilim</Link>
                            <Button onClick={handleLogout} variant="secondary">
                                Çıkış Yap
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleLogin} variant="secondary">
                                Giriş Yap
                            </Button>
                            <Button onClick={handleRegisterClick} variant="primary">
                                 Kayıt Ol
                            </Button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

const styles = {
    header: {
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        padding: '0 2rem',
        position: 'sticky',
        top: '0',
        zIndex: 1000,
    },
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    logo: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: '#3a3a3a',
        textDecoration: 'none',
        fontFamily: "'Nunito', sans-serif",
    },
    menuLinks: {
        display: 'flex',
        gap: '2rem',
    },
    link: {
        textDecoration: 'none',
        color: '#555',
        fontWeight: '600',
        padding: '0.5rem 0',
        borderBottom: '2px solid transparent',
        transition: 'color 0.2s, border-color 0.2s',
    },
    activeLink: {
        textDecoration: 'none',
        color: '#5c8d89',
        fontWeight: '600',
        padding: '0.5rem 0',
        borderBottom: '2px solid #5c8d89',
    },
    authButtons: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    profileLink: {
        textDecoration: 'none',
        color: '#3a3a3a',
        fontWeight: '600',
        marginRight: '1rem',
    }
};

export default Navbar;