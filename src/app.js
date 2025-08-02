// src/App.js - UPDATED WITH USER MANAGEMENT
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

// Yeni User Management Sayfaları
//import UserManagementTestPage from './pages/userManagementTestPage';

// Admin Bileşenleri
//import UserManagement from './components/admin/userManagement';

// Özel Rota Koruma Bileşeni
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />

        <main style={{ flex: '1 0 auto' }}>
          <Routes>
            {/* Herkesin Erişebileceği Rotalar */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Sadece Giriş Yapmış Kullanıcıların Erişebileceği Rotalar */}
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

            {/* User Management Test Sayfası */}
            {/*<Route
              path="/user-management-test"
              element={
                <PrivateRoute>
                  <UserManagementTestPage />
                </PrivateRoute>
              }
            />*/} 

            {/* Admin Sayfaları */}
            {/*<Route
              path="/admin/users"
              element={
                <PrivateRoute>
                  <UserManagement />
                </PrivateRoute>
              }
            />*/}

            {/* 404 sayfası için */}
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <h2>Sayfa Bulunamadı</h2>
                <p>Aradığınız sayfa mevcut değil.</p>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;