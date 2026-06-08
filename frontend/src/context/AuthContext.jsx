import React, { createContext, useState, useEffect } from 'react';
import { gasRequest } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    if (token && role && username) {
      setUser({ token, role, username });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const result = await gasRequest('login', { username, password });
    if (!result.success) {
      throw new Error(result.message || 'Login failed');
    }
    
    const { token, user: userData } = result;
    
    localStorage.setItem('token', token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('username', userData.username);
    
    setUser({ token, role: userData.role, username: userData.username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
