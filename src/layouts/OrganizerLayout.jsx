import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FiHome, FiCalendar, FiBookOpen, FiBell, FiSettings, 
  FiLogOut, FiPlusCircle, FiSun, FiMoon, FiClock
} from 'react-icons/fi';

const OrganizerLayout = () => {
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111827] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#1a2235] border-l border-blue-100 dark:border-gray-700/60 p-4 flex flex-col fixed right-0 top-0 h-full shadow-sm z-30 overflow-y-auto">
        {/* لوگو */}
        <div className="flex items-center gap-3 pb-6 border-b border-blue-100 dark:border-gray-700/60 mb-6">
          <img src="/src/assets/logo.png" alt="لوگو" className="h-10 w-auto" />
          <span className="font-bold text-gray-800 dark:text-white">پنل برگزارکننده</span>
        </div>

        {/* دکمه تغییر تم */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 px-4 py-2 mb-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          {darkMode ? 'حالت روشن' : 'حالت دارک'}
        </button>

        {/* منوی اصلی */}
        <nav className="flex-1 space-y-1">
          {/* نمای کلی */}
          <Link 
            to="/organizer/overview" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
          >
            <FiHome size={20} /> نمای کلی
          </Link>

          {/* رویدادها */}
          <Link 
            to="/organizer/events" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
          >
            <FiCalendar size={20} /> رویدادها
          </Link>

          {/* ایجاد رویداد */}
          <Link 
            to="/organizer/events/create" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
          >
            <FiPlusCircle size={20} /> ایجاد رویداد
          </Link>

          {/* رزروها */}
          <Link 
            to="/organizer/reservations" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
          >
            <FiBookOpen size={20} /> رزروها
          </Link>

          {/* مدیریت زمان‌بندی */}
          <Link 
            to="/organizer/schedules/1" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
          >
            <FiClock size={20} /> مدیریت زمان‌بندی
          </Link>

          {/* اعلان‌ها */}
          <Link 
            to="/organizer/notification" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
          >
            <FiBell size={20} /> اعلان‌ها
          </Link>

          {/* تنظیمات */}
          <Link 
            to="/organizer/setting" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
          >
            <FiSettings size={20} /> تنظیمات
          </Link>
        </nav>

        {/* دکمه خروج */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition mt-auto"
        >
          <FiLogOut size={20} /> خروج
        </button>
      </aside>

      {/* محتوای اصلی */}
      <main className="flex-1 mr-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default OrganizerLayout;
