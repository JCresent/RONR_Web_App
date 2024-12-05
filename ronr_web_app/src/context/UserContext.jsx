import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedId = localStorage.getItem('userId');
    const storedEmail = localStorage.getItem('userEmail');
    return storedId && storedEmail ? {
      id: storedId,
      email: storedEmail
    } : null;
  });

  const updateUser = (userData) => {
    if (userData) {
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userEmail', userData.email);
      setUser({
        id: userData.id,
        email: userData.email
      });
    } else {
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
