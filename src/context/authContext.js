// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getProfile, login, logout, register } from '../services/authService';

// 1. Context nesnesini oluşturuyoruz.
// Başlangıç değeri null, çünkü Provider olmadan kullanılmamalı.
export const AuthContext = createContext(null);

// 2. Provider Bileşeni: Bu bileşen, tüm uygulamayı veya bir kısmını sarar.
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Çok Önemli: Uygulama ilk açıldığında auth durumunu kontrol ederken kullanılır.

  // useCallback ile fonksiyonun gereksiz yere yeniden oluşmasını engelliyoruz.
  const checkUserStatus = useCallback(async () => {
    try {
      // Backend'deki /me veya /profile endpoint'ine istek atarak session'ı kontrol et.
      const response = await getProfile();

      // Backend 200 OK dönerse ve kullanıcı verisi varsa, kullanıcı giriş yapmıştır.
      if (response.data) {
        setIsAuthenticated(true);
        setUserProfile(response.data);
      }
    } catch (error) {
      // Backend 401 Unauthorized veya başka bir hata dönerse, kullanıcı giriş yapmamıştır.
      console.error('Kullanıcı oturumu bulunamadı:', error);
      setIsAuthenticated(false);
      setUserProfile(null);
    } finally {
      // Kontrol işlemi bitti, artık ana uygulamayı gösterebiliriz.
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Uygulama ilk yüklendiğinde (sadece bir kez) kullanıcının giriş durumunu kontrol et.
    checkUserStatus();
  }, [checkUserStatus]);

  // Context aracılığıyla tüm alt bileşenlere sağlanacak değerler.
  const value = {
    isAuthenticated,
    userProfile,
    isLoading,
    login, // authService'ten direkt olarak aldığımız fonksiyonlar
    logout,
    register,
    // Kullanıcı profilini manuel olarak yenilemek için bir fonksiyon da ekleyebiliriz.
    refreshUser: checkUserStatus,
  };

  // isLoading true ise, uygulamanın geri kalanını render etme.
  // Bu, korumalı rotaların ve Navbar'ın yanlışlıkla yanlış durumu göstermesini engeller.
  // Buraya daha şık bir "Yükleniyor..." ekranı veya spinner bileşeni konulabilir.
  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Uygulama Yükleniyor...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};