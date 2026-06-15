import React, { createContext, useState } from 'react';


export const UserContext = createContext();


export const UserProvider = ({ children }) => {
  
  const [userData, setUserData] = useState({
    name: 'فلان فلانی',
    phone: '۰۹۹۱ ۶۶۵۰۲۲۱',
    avatar: './src/assets/profile.png' 
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};