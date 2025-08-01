// src/components/common/Input.js
import React from 'react';

/**
 * Yeniden kullanılabilir input bileşeni.
 * @param {object} props
 * @param {string} props.id - Input ve label'ı birbirine bağlamak için benzersiz ID.
 * @param {string} props.label - Input'un üstünde görünecek etiket metni.
 * @param {string} [props.type='text'] - Input'un tipi (text, password, email, date, vb.).
 * @param {string} props.value - Input'un mevcut değeri.
 * @param {function} props.onChange - Değer değiştiğinde tetiklenecek fonksiyon.
 * @param {string} [props.placeholder] - Input boşken görünecek ipucu metni.
 * @param {string | null} [props.error=null] - Bir hata varsa gösterilecek hata mesajı.
 */
const Input = ({ id, label, type = 'text', value, onChange, placeholder, error = null, ...props }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  };

  const labelStyle = {
    marginBottom: '8px',
    fontWeight: '600',
    color: '#3a3a3a',
    fontFamily: "'Lato', sans-serif",
  };

  const inputBaseStyle = {
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: "'Lato', sans-serif",
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const inputErrorStyle = {
    border: '1px solid #d32f2f', // Hata durumunda kırmızı border
    boxShadow: '0 0 0 1px #d32f2f',
  };

  const errorMessageStyle = {
    marginTop: '4px',
    color: '#d32f2f', // Hata mesajı rengi
    fontSize: '0.875rem',
  };

  // Hata varsa hata stilini, yoksa normal stili uygula
  const finalInputStyle = {
    ...inputBaseStyle,
    ...(error && inputErrorStyle),
  };

  return (
    <div style={containerStyle}>
      {label && <label htmlFor={id} style={labelStyle}>{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={finalInputStyle}
        {...props} // required, maxLength gibi diğer propları ekler
      />
      {error && <span style={errorMessageStyle}>{error}</span>}
    </div>
  );
};

export default Input;