// src/components/common/Button.js
import React from 'react';

/**
 * Yeniden kullanılabilir buton bileşeni.
 * @param {object} props
 * @param {React.ReactNode} props.children - Butonun içinde görünecek metin veya ikon.
 * @param {function} props.onClick - Butona tıklandığında çalışacak fonksiyon.
 * @param {'primary' | 'secondary'} [props.variant='primary'] - Butonun görünüm stili.
 * @param {boolean} [props.disabled=false] - Butonun tıklanabilir olup olmadığı.
 * @param {'submit' | 'button'} [props.type='button'] - Butonun HTML tipi.
 */
const Button = ({ children, onClick, variant = 'primary', disabled = false, type = 'button', ...props }) => {
  // Temel stil her zaman uygulanır.
  const baseStyle = {
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px', // Daha soft bir görünüm için border-radius
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
    fontFamily: "'Nunito', sans-serif", // index.html'de eklediğimiz font
  };

  // Varyantlara göre değişen stiller.
  const variantStyles = {
    primary: {
      backgroundColor: '#5c8d89', // Ana renk (Sakin yeşil-mavi)
      color: 'white',
    },
    secondary: {
      backgroundColor: '#f0e5d8', // İkincil renk (Bej/Krem)
      color: '#3a3a3a',
      border: '1px solid #dcdcdc'
    },
  };

  // Hover efekti için stil (pseudo-class'lar inline style'da doğrudan desteklenmez,
  // bu yüzden genellikle CSS dosyası veya styled-components ile yapılır ama burada basit bir JS çözümü gösterelim)
  const handleMouseOver = (e) => {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(-2px)';
    }
  };

  const handleMouseOut = (e) => {
      e.currentTarget.style.transform = 'translateY(0)';
  };

  // Buton pasif (disabled) ise uygulanacak stil.
  const disabledStyle = {
    backgroundColor: '#cccccc',
    color: '#666666',
    cursor: 'not-allowed',
    transform: 'none',
  };

  // Son stili, temel, varyant ve pasif durum stillerini birleştirerek oluştururuz.
  const finalStyle = {
    ...baseStyle,
    ...(variantStyles[variant]),
    ...(disabled && disabledStyle),
  };

  return (
    <button
      style={finalStyle}
      onClick={onClick}
      disabled={disabled}
      type={type}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      {...props} // className gibi dışarıdan gelen diğer propları ekler
    >
      {children}
    </button>
  );
};

export default Button;