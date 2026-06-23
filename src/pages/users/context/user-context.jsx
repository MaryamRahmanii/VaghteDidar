// src/pages/users/context/user-context.jsx
import React, { createContext, useState, useEffect } from 'react';

import { iamApi } from '../../../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      console.log("در حال ارسال توکن:", localStorage.getItem('access_token'));

      const response = await iamApi.get('/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // ===== فقط این خط تغییر کرده =====
      setUserData({
        ...response.data,
        public_slug: response.data.public_slug || '',
      });
    } catch (error) {
      console.error("خطا در دریافت اطلاعات کاربر:", error);
      localStorage.removeItem('access_token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, fetchUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
