import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { UserContext } from '../users/context/user-context';
import { 
  FiUser, FiPhone, FiMail, FiSave, FiLock, FiLogOut, 
  FiBell, FiMoon, FiSun, FiTrash2, FiEdit2, FiLink, FiCopy
} from 'react-icons/fi';
import CopyLinkButton from './components/CopyLinkButton';

const Settings = () => {
  const { darkMode, setDarkMode } = useTheme();
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [slugMessage, setSlugMessage] = useState('');
  
  const [profile, setProfile] = useState({
    name: userData?.full_name || 'فلان فلانی',
    phone: userData?.phone_number || '۰۹۹۱ ۶۶۵۰۲۲۱',
    email: 'example@email.com',
    bio: 'مشاور کسب و کار با ۱۰ سال سابقه',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    dailySummary: false,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ===== بخش شناسه عمومی =====
  const [publicSlug, setPublicSlug] = useState(userData?.public_slug || '');
  const [slugLoading, setSlugLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: اتصال به بک‌اند
    // await bookingApi.patch('/organizer/profile', profile);
    setUserData({ ...userData, full_name: profile.name, phone_number: profile.phone });
    setTimeout(() => {
      setLoading(false);
      alert('تنظیمات با موفقیت ذخیره شد!');
    }, 1000);
  };

  // ===== ذخیره شناسه عمومی =====
  const handleSaveSlug = async () => {
    if (!publicSlug.trim()) {
      setSlugMessage('لطفاً شناسه را وارد کنید.');
      return;
    }
    if (!/^[a-zA-Z0-9\-]+$/.test(publicSlug)) {
      setSlugMessage('فقط حروف انگلیسی، اعداد و خط تیره مجاز است.');
      return;
    }
    if (publicSlug.length < 3) {
      setSlugMessage('شناسه باید حداقل ۳ کاراکتر باشد.');
      return;
    }

    setSlugLoading(true);
    setSlugMessage('');

    try {
      // TODO: اتصال به بک‌اند
      // const response = await iamApi.post('/organizer/update-slug', { new_slug: publicSlug });
      // setUserData({ ...userData, public_slug: response.data.new_slug });
      
      // ===== شبیه‌سازی موقت =====
      setTimeout(() => {
        setUserData({ ...userData, public_slug: publicSlug });
        setSlugMessage('✅ شناسه با موفقیت ذخیره شد!');
        setSlugLoading(false);
      }, 1000);
    } catch (error) {
      setSlugMessage('❌ خطا در ذخیره شناسه');
      setSlugLoading(false);
    }
  };

  const copyLink = () => {
    if (!userData?.public_slug) return;
    const link = `${window.location.origin}/organizer/${userData.public_slug}`;
    navigator.clipboard.writeText(link);
    setSlugMessage('✅ لینک کپی شد!');
    setTimeout(() => setSlugMessage(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('آیا از حذف دائمی حساب خود مطمئن هستید؟ این عملیات غیرقابل بازگشت است.')) {
      // TODO: اتصال به بک‌اند
      // await bookingApi.delete('/organizer/account');
      localStorage.removeItem('access_token');
      navigate('/login');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen bg-gray-50 dark:bg-[#111827]">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">تنظیمات برگزارکننده</h1>

      <div className="space-y-6">
        {/* ===== بخش ۱: شناسه عمومی (جدید) ===== */}
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 sm:p-6 shadow-sm border-r-4 border-blue-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FiLink className="text-blue-500" size={20} />
              شناسه عمومی پروفایل
            </h2>
            {userData?.public_slug && <CopyLinkButton />}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            با این شناسه، کاربران می‌توانند پروفایل عمومی شما را پیدا کنند.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                شناسه یکتا (Slug)
              </label>
              <input
                type="text"
                value={publicSlug}
                onChange={(e) => setPublicSlug(e.target.value)}
                placeholder="مثال: my-academy"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-[#111827] text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="ltr"
                disabled={slugLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                فقط حروف انگلیسی (a-z)، اعداد (0-9) و خط تیره (-) مجاز است.
                {userData?.public_slug && ` شناسه فعلی: ${userData.public_slug}`}
              </p>
            </div>
            <button
              onClick={handleSaveSlug}
              disabled={slugLoading || publicSlug === userData?.public_slug}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap mt-2 sm:mt-6 ${
                slugLoading || publicSlug === userData?.public_slug
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
              }`}
            >
              {slugLoading ? '⏳ در حال ذخیره...' : '💾 ذخیره'}
            </button>
          </div>

          {slugMessage && (
            <div className={`mt-3 p-3 rounded-lg ${
              slugMessage.includes('✅') 
                ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300' 
                : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300'
            }`}>
              {slugMessage}
            </div>
          )}

          {userData?.public_slug && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-[#111827] rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">لینک پروفایل شما:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white dark:bg-[#1a2235] border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-sm font-mono break-all" dir="ltr">
                  {`${window.location.origin}/organizer/${userData.public_slug}`}
                </code>
                <button
                  onClick={copyLink}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition flex items-center gap-1"
                >
                  <FiCopy size={16} /> کپی
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===== بخش ۲: اطلاعات پروفایل ===== */}
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">اطلاعات پروفایل</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">نام و نام خانوادگی</label>
              <div className="relative">
                <FiUser className="absolute right-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  name="name"
                  className="w-full pr-10 px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profile.name}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">شماره تلفن</label>
              <div className="relative">
                <FiPhone className="absolute right-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  name="phone"
                  className="w-full pr-10 px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">ایمیل (اختیاری)</label>
              <div className="relative">
                <FiMail className="absolute right-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  className="w-full pr-10 px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">توضیحات</label>
              <textarea
                name="bio"
                rows="3"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={profile.bio}
                onChange={handleProfileChange}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
                }`}
              >
                <FiSave size={18} /> {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
            </div>
          </form>
        </div>

        {/* ===== بخش ۳: تنظیمات اعلان ===== */}
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">تنظیمات اعلان</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiBell className="text-blue-600 dark:text-blue-400" size={20} />
                <span className="text-sm text-gray-700 dark:text-gray-300">دریافت ایمیل در صورت ثبت‌نام جدید</span>
              </div>
              <input
                type="checkbox"
                name="email"
                checked={notifications.email}
                onChange={handleNotificationChange}
                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiBell className="text-blue-600 dark:text-blue-400" size={20} />
                <span className="text-sm text-gray-700 dark:text-gray-300">دریافت پیامک در صورت ثبت‌نام جدید</span>
              </div>
              <input
                type="checkbox"
                name="sms"
                checked={notifications.sms}
                onChange={handleNotificationChange}
                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiBell className="text-blue-600 dark:text-blue-400" size={20} />
                <span className="text-sm text-gray-700 dark:text-gray-300">دریافت خلاصه روزانه نوبت‌های فردا</span>
              </div>
              <input
                type="checkbox"
                name="dailySummary"
                checked={notifications.dailySummary}
                onChange={handleNotificationChange}
                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ===== بخش ۴: تم و امنیت ===== */}
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">تم و امنیت</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <FiMoon className="text-blue-600 dark:text-blue-400" size={20} /> : <FiSun className="text-blue-600 dark:text-blue-400" size={20} />}
                <span className="text-sm text-gray-700 dark:text-gray-300">حالت {darkMode ? 'دارک' : 'روشن'}</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition"
              >
                تغییر به حالت {darkMode ? 'روشن' : 'دارک'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiLock className="text-blue-600 dark:text-blue-400" size={20} />
                <span className="text-sm text-gray-700 dark:text-gray-300">تغییر شماره تلفن</span>
              </div>
              <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition">
                تغییر شماره
              </button>
            </div>
          </div>
        </div>

        {/* ===== بخش ۵: خروج و حذف حساب ===== */}
        <div className="bg-white dark:bg-[#1a2235] border border-red-100 dark:border-red-900/50 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold transition"
            >
              <FiLogOut size={18} /> خروج از حساب
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition"
            >
              <FiTrash2 size={18} /> حذف حساب کاربری
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
            حذف حساب به معنی از دست دادن تمام رویدادها، رزروها و داده‌های شماست. این عملیات غیرقابل بازگشت است.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
