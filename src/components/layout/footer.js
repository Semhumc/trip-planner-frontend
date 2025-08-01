// src/components/layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    // Yılı dinamik olarak almak, her zaman güncel kalmasını sağlar.
    const currentYear = new Date().getFullYear();

    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.links}>
                    <Link to="/about" style={styles.link}>Hakkımızda</Link>
                    <Link to="/privacy-policy" style={styles.link}>Gizlilik Politikası</Link>
                    <Link to="/terms" style={styles.link}>Kullanım Şartları</Link>
                </div>
                <p style={styles.copyright}>
                    © {currentYear} Trip Planner. Tüm hakları saklıdır.
                </p>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#f8f9fa',
        color: '#6c757d',
        padding: '2rem 1rem',
        borderTop: '1px solid #e7e7e7',
        marginTop: 'auto', // Bu, içeriğin az olduğu sayfalarda footer'ı aşağıya iter.
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
    },
    links: {
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '1.5rem',
    },
    link: {
        color: '#6c757d',
        textDecoration: 'none',
        transition: 'color 0.2s',
    },
    copyright: {
        margin: 0,
        fontSize: '0.9rem',
    }
};

export default Footer;