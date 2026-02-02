import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));  
      setLoading(false);  
    } else {
      localStorage.removeItem('user');  
      setLoading(false); 
    }
  }, [user]);

  
  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post('/api/users/register', {
        name,
        email,
        password,
        role,
      });
      if (response.data) {
        setUser(response.data);  
      }
    } catch (error) {
      console.error('Registration failed:', error.response.data.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/users/login', { email, password });
      if (response.data) {
        setUser(response.data);  
      }
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);  
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
