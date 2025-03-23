import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("user") ? true : false;
  });

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const login = (token, role) => {
    const userData = { token, role };
    localStorage.setItem("user", JSON.stringify(userData)); 
    setIsAuthenticated(true);
    setUser(userData);
  };  

  const logout = () => {
    localStorage.removeItem("user"); // Remove user data from storage
    setIsAuthenticated(false);
    setUser(null);
  };

  // Ensure user data is loaded from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
