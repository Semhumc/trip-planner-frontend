
// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

/**
 * Kimlik doğrulama context'ine kolay erişim sağlayan özel bir hook.
 * Bu hook, AuthProvider içinde kullanılmalıdır.
 * @returns {{
 *   isAuthenticated: boolean,
 *   userProfile: object | null,
 *   isLoading: boolean,
 *   login: function,
 *   logout: function,
 *   register: function,
 *   refreshUser: function
 * }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Geliştirici hatasını önlemek için bir kontrol.
  // Eğer bu hook AuthProvider'ın dışında kullanılırsa, context 'null' olacaktır.
  if (context === null) {
    throw new Error('useAuth hook, bir AuthProvider bileşeni içinde kullanılmalıdır!');
  }

  return context;
};