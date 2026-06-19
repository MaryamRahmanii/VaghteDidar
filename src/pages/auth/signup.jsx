import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { iamApi } from '../../services/api';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); 

    try {
      
      await iamApi.post('/auth/otp/signup/request', { 
        phone_number: phoneNumber, 
        type: 'register' 
      });
      
      navigate('/signup-otp', { state: { phone: phoneNumber, fullName: fullName } });
    } catch (error) {
      console.error(error);
      
     
      if (error.response) {
        
        if (error.response.status === 409 || error.response.status === 400) {
          setErrorMessage('کاربری با این شماره قبلاً ثبت‌نام کرده است. لطفاً وارد شوید.');
        } else {
          setErrorMessage('خطایی در ارتباط با سرور رخ داد. لطفاً دوباره تلاش کنید.');
        }
      } else {
        setErrorMessage('ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-11/12 sm:w-full max-w-sm bg-white dark:bg-[#1f2937] rounded-2xl border-2 border-blue-100 dark:border-transparent px-6 py-10 sm:px-8 sm:py-12 shadow-sm mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white mb-8 sm:mb-10">ثبت نام</h1>
      
     
      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-xs sm:text-sm text-center mb-6 animate-fade-in">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-2.5 text-center sm:text-right">نام و نام خانوادگی</label>
          <input
            type="text"
            placeholder="نام خود را وارد کنید"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-3.5 text-xs sm:text-sm rounded-lg border-none bg-[#1e293b] text-white placeholder-gray-400 dark:bg-[#e5e7eb] dark:text-gray-900 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center sm:text-right transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-2.5 text-center sm:text-right">شماره موبایل</label>
          <input
            type="tel"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            dir="rtl"
            className="w-full px-4 py-3.5 text-xs sm:text-sm rounded-lg border-none bg-[#1e293b] text-white placeholder-gray-400 dark:bg-[#e5e7eb] dark:text-gray-900 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center sm:text-right transition-colors"
          />
        </div>
        <div className="text-center text-xs mt-4">
          <span className="text-gray-500 dark:text-gray-400">حساب کاربری دارید؟ </span>
          <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">ورود</Link>
        </div>
        <div className="flex justify-center pt-2 sm:pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`rounded-full px-8 py-3 text-xs sm:text-sm font-medium transition-colors duration-200 ${
              isLoading 
                ? 'bg-blue-400 cursor-not-allowed text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? 'در حال ارسال...' : 'دریافت کد تایید'}
          </button>
        </div>
      </form>
    </div>
  );
}; 

export default Signup;