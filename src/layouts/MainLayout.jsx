import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111827] text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300" dir="rtl">
      
     
      <header className="flex justify-between items-center px-6 py-2 sm:py-3 bg-white dark:bg-[#1f2937] shadow-sm sticky top-0 z-50">
        
       
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition" 
            title="تغییر پوسته"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>

          <Link to="/profile" className="text-blue-600 dark:text-blue-400 hover:text-blue-800" title="پروفایل کاربری">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </Link>

          <Link to="/signup" className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition">
            شروع رایگان
          </Link>
        </div>

     
        <div className="flex items-center gap-2">
          <Link to="/">
            <div className="h-14 sm:h-16 w-auto flex justify-center items-center rounded-lg">
              <img 
                src="./src/assets/logo.png" 
                alt="لوگو" 
               
                className="w-full h-full object-contain scale-[1.3] sm:scale-[1.5] origin-left transition-transform" 
              />
            </div>
          </Link>
        </div>

      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-[#1f2937] border-t dark:border-gray-700 py-8 text-center mt-12">
        <div className="flex justify-center gap-6 mb-6 text-sm text-blue-600 dark:text-blue-400">
          <Link to="#">پشتیبانی</Link>
          <Link to="#">درباره ی ما</Link>
          <Link to="#">تماس با ما</Link>
          <Link to="#">حریم خصوصی</Link>
        </div>
        <p className="text-xs text-gray-400">© 2026 Nobito. All rights reserved</p>
      </footer>

    </div>
  );
};

export default MainLayout;