import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginOtp = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const userPhone = location.state?.phone || 'نامشخص';

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="w-11/12 sm:w-full max-w-sm bg-white dark:bg-[#1f2937] rounded-2xl border-2 border-blue-100 dark:border-transparent px-6 py-10 sm:px-8 sm:py-12 shadow-sm mx-auto">
      
      <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
        تایید ورود
      </h1>
      
      <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-8 sm:mb-10">
        کد ورود به شماره <span className="font-bold text-gray-700 dark:text-gray-200" dir="ltr">{userPhone}</span> ارسال شد.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-2.5 text-center sm:text-right">
            کد یکبار مصرف
          </label>
          <input 
            type="text" 
            placeholder="کد پیامک شده را وارد کنید" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            required 
            
            className="w-full px-4 py-3.5 text-xs sm:text-sm rounded-lg border-none bg-[#1e293b] text-white placeholder-gray-400 dark:bg-[#e5e7eb] dark:text-gray-900 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center sm:text-right" 
          />
        </div>

        <div className="flex justify-center pt-2 sm:pt-4">
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 text-xs sm:text-sm font-medium transition-colors duration-200"
          >
            ورود به سامانه
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default LoginOtp;