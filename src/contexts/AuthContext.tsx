'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get environment variables at build time
const ENV = {
  USERNAME: process.env.NEXT_PUBLIC_USERNAME || '',
  PASSWORD: process.env.NEXT_PUBLIC_PASSWORD || '',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (username: string, password: string) => {
    // Debug logging
    console.log('Login attempt with:', {
      username,
      expectedUsername: ENV.USERNAME,
      password,
      expectedPassword: ENV.PASSWORD,
      env: process.env
    });

    // In a real app, you would validate against your backend
    if (username === ENV.USERNAME && password === ENV.PASSWORD) {
      setIsAuthenticated(true);
      // Store authentication state in localStorage
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  // Check for existing authentication on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

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