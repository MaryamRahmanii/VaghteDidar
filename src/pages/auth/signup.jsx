import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/signup-otp', { state: { phone: phoneNumber } });
  };

  return (
    
    <div className="w-11/12 sm:w-full max-w-sm bg-white dark:bg-[#1f2937] rounded-2xl border-2 border-blue-100 dark:border-transparent px-6 py-10 sm:px-8 sm:py-12 shadow-sm mx-auto">
      
      <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white mb-8 sm:mb-10">
        ثبت نام
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-2.5 text-center sm:text-right">
            نام و نام خانوادگی
          </label>
          <input
            type="text"
            placeholder="نام و نام خانوادگی خود را وارد کنید"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-3.5 text-xs sm:text-sm rounded-lg border-none bg-[#1e293b] text-white placeholder-gray-400 dark:bg-[#e5e7eb] dark:text-gray-900 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center sm:text-right"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-2.5 text-center sm:text-right">
            شماره ی تلفن همراه
          </label>
          <input
            type="tel"
            placeholder="شماره ی تلفن همراه خود را وارد کنید"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            dir="rtl"
            className="w-full px-4 py-3.5 text-xs sm:text-sm rounded-lg border-none bg-[#1e293b] text-white placeholder-gray-400 dark:bg-[#e5e7eb] dark:text-gray-900 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center sm:text-right"
          />
        </div>

        <div className="text-center text-xs mt-4">
          <span className="text-gray-500 dark:text-gray-400">اکانت دارید؟ </span>
          <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">
            وارد صفحه ی ورود شوید
          </Link>
        </div>

        <div className="flex justify-center pt-2 sm:pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 text-xs sm:text-sm font-medium transition-colors duration-200"
          >
            ارسال رمز یکبار مصرف
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default Signup;