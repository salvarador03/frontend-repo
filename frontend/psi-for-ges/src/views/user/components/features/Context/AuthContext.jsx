import React, { createContext, useContext, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const cookies = localStorage.getItem('cookiesAccepted') === 'true';
    const registered = localStorage.getItem('isRegistered') === 'true';
    if (token) {
      setIsLoggedIn(true);
      setUser(getUserFromToken(token));
    }
    setCookiesAccepted(cookies);
    setIsRegistered(registered);
  }, []);

  const login = (token) => {
    setIsLoggedIn(true);
    localStorage.setItem('authToken', token);
    setUser(getUserFromToken(token));
    setIsRegistered(true);
    localStorage.setItem('isRegistered', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('authToken');
    setUser(null);
    setIsRegistered(false);
    localStorage.removeItem('isRegistered');
  };

  const acceptCookies = () => {
    setCookiesAccepted(true);
    localStorage.setItem('cookiesAccepted', 'true');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, cookiesAccepted, acceptCookies, isRegistered, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const getUserFromToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    const roles = decoded?.authorities || ["ROLE_USER"];
    return {
      id: decoded?.id,
      username: decoded?.username,
      name: decoded?.name,
      lastName: decoded?.lastName,
      profilePicture: decoded?.profilePicture,
      email: decoded?.email,
      city: decoded?.city,
      country: decoded?.country,
      phone: decoded?.phone,
      roles: roles,
      bloqueado: decoded?.blocked,  // Añadir el estado bloqueado del usuario
      fechaNacimiento: decoded?.fechaNacimiento,  // Ajuste en el nombre del campo
    };
  } catch (error) {
    console.error('Failed to decode token', error);
    return null;
  }
};

export const useAuth = () => useContext(AuthContext);
