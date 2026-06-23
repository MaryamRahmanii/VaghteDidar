import React, { useState, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from './context/user-context'; 
import { iamApi } from '../../services/api';

const EditProfile = () => {
  const navigate = useNavigate();
  const { userData, fetchUser } = useContext(UserContext); 
  
  const [formData, setFormData] = useState({
    name: userData?.full_name || '',
    phone: userData?.phone_number || ''
  });

  const [previewAvatar, setPreviewAvatar] = useState(
    userData?.profile_photo_url ? `http://localhost:8001${userData.profile_photo_url}` : ''
  );
  
  const [selectedFile, setSelectedFile] = useState(null); 
  const [isAvatarDeleted, setIsAvatarDeleted] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setErrorMessage('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); 
      setIsAvatarDeleted(false);
      const imageUrl = URL.createObjectURL(file);
      setPreviewAvatar(imageUrl); 
    }
  };

  const handleRemoveImage = () => {
    setPreviewAvatar(''); 
    setSelectedFile(null);
    setIsAvatarDeleted(true); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (isAvatarDeleted && userData?.profile_photo_url) {
        await iamApi.delete('/profile/photo');
      } 
      else if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        
        await iamApi.post('/profile/photo', uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      
      await iamApi.put('/profile/info', {
        full_name: formData.name,
        phone_number: formData.phone
      });

      await fetchUser();
      navigate('/profile');
      
    } catch (error) {
      console.error("خطا در بروزرسانی پروفایل:", error);
      
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.detail || "این شماره موبایل قابل استفاده نیست.");
      } else {
        setErrorMessage("خطا در برقراری ارتباط با سرور. لطفا مجدداً تلاش کنید.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#111827] transition-colors duration-300 p-4" dir="rtl">
      <div className="w-full max-w-md bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-3xl p-6 sm:p-8 shadow-xl animate-fade-in relative overflow-hidden">
        
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-center mb-8 relative z-10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">ویرایش پروفایل</h2>
          <Link to="/profile" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </Link>
        </div>

        <div className="flex flex-col items-center mb-6 relative z-10">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border-4 border-white dark:border-[#1a2235] shadow-md relative group">
            {previewAvatar ? (
              <img src={previewAvatar} alt="آواتار" className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full text-gray-400 p-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            )}
            
            <div 
              onClick={() => fileInputRef.current.click()}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </div>
          </div>

          <div className="flex gap-4 mt-3">
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
            >
              تغییر عکس
            </button>
            
            {previewAvatar && (
              <button 
                type="button" 
                onClick={handleRemoveImage}
                className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
              >
                حذف
              </button>
            )}
          </div>
          
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
          />
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
            <p className="text-xs font-bold text-red-600 dark:text-red-400">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">نام و نام خانوادگی</label>
            <div className="relative">
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">شماره تلفن همراه</label>
            <div className="relative">
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                dir="ltr"
                required
                className="w-full bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-left font-medium" 
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed text-white shadow-none' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>در حال ذخیره...</span>
                </>
              ) : (
                'ذخیره تغییرات'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link to="/profile" className="inline-block text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors">
              انصراف و بازگشت
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EditProfile;