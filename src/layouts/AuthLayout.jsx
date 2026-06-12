import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#111827] transition-colors duration-300" dir="rtl">
      
      <div className="w-full flex flex-col items-center justify-center space-y-6 sm:space-y-8 py-8">
        
        
        <Link to="/" className="group relative flex justify-center items-center" title="بازگشت به صفحه اصلی">
          
          
          <div className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/40 dark:bg-blue-500/50 rounded-full blur-2xl transition-all duration-500 group-hover:bg-blue-400/60 group-hover:scale-150"></div>

          
          <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 transition-transform duration-300 group-hover:scale-110">
            <img 
              src="/src/assets/logo.png" 
              alt="لوگوی سایت" 
              
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] dark:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" 
            />
          </div>

        </Link>

        
        <Outlet />
        
      </div>

    </div>
  );
};

export default AuthLayout;