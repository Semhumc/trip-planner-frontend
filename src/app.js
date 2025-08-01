// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Bileşenleri
import Navbar from './components/layout/navbar';
import Footer from './components/layout/footer';

// Sayfa (Page) Bileşenleri
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/dashboardPage';
import MyTripsPage from './pages/myTripsPage';
import ProfilePage from './pages/profilePage';

// Özel Rota Koruma Bileşeni
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    // Router, uygulamanızda URL bazlı gezinmeyi mümkün kılar.
    <Router>
      {/* Bu div, footer'ı her zaman sayfanın en altına itmeye yardımcı olur. */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navbar, Routes dışında olduğu için tüm sayfalarda görünür. */}
        <Navbar />

        {/* main elementi, sayfa içeriğini sarar ve esnek büyüme sağlar. */}
        <main style={{ flex: '1 0 auto' }}>
          {/* Routes, mevcut URL'ye göre hangi Route'un render edileceğini belirler. */}
          <Routes>
            {/* Herkesin Erişebileceği Rotalar */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Sadece Giriş Yapmış Kullanıcıların Erişebileceği Rotalar */}
            {/* Bu rotalar, PrivateRoute bileşeni ile sarmalanmıştır. */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-trips"
              element={
                <PrivateRoute>
                  <MyTripsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            {/* Eşleşmeyen tüm yollar için bir 404 sayfası eklenebilir. */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </main>

        {/* Footer, Routes dışında olduğu için tüm sayfalarda görünür. */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;