import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../services/api';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('token') !== null;
  });

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(token !== null);
    };

    window.addEventListener('storage', checkToken);
    checkToken();

    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { access_token } = await apiLogin(username, password);
      localStorage.setItem('token', access_token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};