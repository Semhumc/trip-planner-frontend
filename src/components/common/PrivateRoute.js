// src/components/common/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Eğer kullanıcı giriş yapmamışsa, onu login sayfasına yönlendir.
  // 'state: { from: location }' kısmı, başarılı girişten sonra kullanıcının
  // gitmeye çalıştığı sayfaya geri dönmesini sağlar.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Giriş yapmışsa, istenen sayfayı (children) göster.
  return children;
};

export default PrivateRoute;