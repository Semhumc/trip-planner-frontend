// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. Global stilleri projenin en başında import ediyoruz.
import './styles/global.css';

// 2. Ana uygulama bileşenimiz.
import App from './app';

// 3. Kimlik doğrulama context'inin sağlayıcısı.
import { AuthProvider } from './context/authContext';

// React uygulamasının bağlanacağı DOM elementini seçiyoruz.
// Bu element, public/index.html dosyasının içindedir.
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// 4. Uygulamayı render ediyoruz.
// StrictMode, geliştirme sırasında potansiyel sorunları bulmaya yardımcı olur.
// AuthProvider, tüm App bileşenini sararak auth state'ini her yerden erişilebilir kılar.
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);