import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { UserContext } from '../users/context/user-context';
import { 
  FiCalendar, FiClock, FiUsers, FiTrendingUp, FiTrash2,
  FiCheckCircle, FiXCircle, FiClock as FiPending, FiBarChart2,
  FiPlusCircle
} from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import CopyLinkButton from './components/CopyLinkButton';

const Overview = () => {
  const { darkMode } = useTheme();
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // داده‌های mock
  const mockStats = {
    activeEvents: 3,
    activeBookings: 42,
    uniqueParticipants: 38,
    nextEventFillPercent: 75,
    nextEventName: "وبینار مصاحبه شغلی"
  };
  const mockUpcomingEvents = [
    { id: 1, name: "کارگاه مکالمه", date: "۱۴۰۲/۱۲/۱۰", time: "۱۰:۰۰", registered: 8, capacity: 10, fillPercent: 80 },
    { id: 2, name: "دوره گرامر پیشرفته", date: "۱۴۰۲/۱۲/۱۲", time: "۱۴:۰۰", registered: 5, capacity: 8, fillPercent: 62 },
    { id: 3, name: "کارگاه رایتینگ آیلتس", date: "۱۴۰۲/۱۲/۱۴", time: "۱۶:۰۰", registered: 12, capacity: 15, fillPercent: 80 },
  ];
  const mockTodayAppointments = [
    { id: 1, timeStart: "۱۰:۰۰", timeEnd: "۱۰:۳۰", participantName: "مریم احمدی", eventName: "کارگاه مکالمه", status: "upcoming" },
    { id: 2, timeStart: "۱۱:۰۰", timeEnd: "۱۱:۳۰", participantName: "علی کریمی", eventName: "دوره گرامر", status: "upcoming" },
    { id: 3, timeStart: "۰۹:۰۰", timeEnd: "۰۹:۳۰", participantName: "سارا حسنی", eventName: "تست تعیین سطح", status: "past" },
  ];
  const mockRecentMessages = [
    { id: 1, title: "یادآوری جلسه فردا", date: "۱۴۰۲/۱۲/۰۷", recipients: 12 },
    { id: 2, title: "لغو نوبت به دلیل تعطیلی", date: "۱۴۰۲/۱۲/۰۶", recipients: 1 },
    { id: 3, title: "تغییر ساعت جلسه", date: "۱۴۰۲/۱۲/۰۵", recipients: 8 },
  ];
  const mockWeeklyReservations = [
    { day: 'شنبه', count: 12 },
    { day: 'یکشنبه', count: 18 },
    { day: 'دوشنبه', count: 14 },
    { day: 'سه‌شنبه', count: 22 },
    { day: 'چهارشنبه', count: 20 },
    { day: 'پنجشنبه', count: 9 },
    { day: 'جمعه', count: 5 },
  ];
  const mockTodaySummary = {
    totalAppointments: 7,
    completed: 2,
    pending: 3,
    cancelled: 2,
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleCancelAppointment = (appointmentId, participantName) => {
    console.log(`لغو نوبت ${appointmentId} برای ${participantName}`);
    alert(`درخواست لغو نوبت ${participantName} به سرور ارسال شد.`);
  };

  const handleEventClick = (eventId) => {
    navigate(`/organizer/reservations?eventId=${eventId}`);
  };

  const getProgressColor = (percent) => {
    if (percent < 70) return 'bg-green-500';
    if (percent < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const tooltipStyle = {
    backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
    color: darkMode ? '#F1F5F9' : '#1F2937',
    border: `1px solid ${darkMode ? '#334155' : '#E5E7EB'}`,
    borderRadius: '8px',
    padding: '8px 12px',
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#111827]">
        <div className="text-gray-500 dark:text-gray-400">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-[#111827]">
      {/* هدر با دکمه کپی لینک */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">نمای کلی</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">خوش آمدید</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* دکمه کپی لینک (جدید) */}
          <CopyLinkButton />
          
          <Link 
            to="/organizer/events/create" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-blue-500/30"
          >
            <FiPlusCircle size={18} /> ایجاد رویداد جدید
          </Link>
        </div>
      </div>

      {/* ۴ کارت آمار */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl text-blue-600 dark:text-blue-400"><FiCalendar /></span>
            <span className="text-xs text-gray-400 dark:text-gray-500">آمار</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">رویدادهای فعال</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{mockStats.activeEvents}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">از مجموع ۵ رویداد</p>
        </div>
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl text-blue-600 dark:text-blue-400"><FiClock /></span>
            <span className="text-xs text-gray-400 dark:text-gray-500">آمار</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">نوبت‌های فعال (رزرو شده)</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{mockStats.activeBookings}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">در حال حاضر</p>
        </div>
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl text-blue-600 dark:text-blue-400"><FiUsers /></span>
            <span className="text-xs text-gray-400 dark:text-gray-500">آمار</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">شرکت‌کنندگان منحصربه‌فرد</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{mockStats.uniqueParticipants}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">در تمام رویدادها</p>
        </div>
        <div 
          className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer hover:border-blue-400"
          onClick={() => handleEventClick(1)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl text-blue-600 dark:text-blue-400"><FiTrendingUp /></span>
            <span className="text-xs text-gray-400 dark:text-gray-500">رویداد بعدی</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">پر شدن ظرفیت</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{mockStats.nextEventFillPercent}%</p>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
            <div className={`h-full rounded-full ${getProgressColor(mockStats.nextEventFillPercent)}`} style={{ width: `${mockStats.nextEventFillPercent}%` }}></div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{mockStats.nextEventName}</p>
        </div>
      </div>

      {/* خلاصه وضعیت امروز */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 text-center">
          <div className="text-2xl text-blue-600 dark:text-blue-400 mb-1"><FiCalendar /></div>
          <p className="text-xs text-gray-600 dark:text-gray-400">کل نوبت‌های امروز</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{mockTodaySummary.totalAppointments}</p>
        </div>
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 text-center">
          <div className="text-2xl text-green-500 mb-1"><FiCheckCircle /></div>
          <p className="text-xs text-gray-600 dark:text-gray-400">انجام شده</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{mockTodaySummary.completed}</p>
        </div>
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 text-center">
          <div className="text-2xl text-yellow-500 mb-1"><FiPending /></div>
          <p className="text-xs text-gray-600 dark:text-gray-400">در انتظار</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{mockTodaySummary.pending}</p>
        </div>
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 text-center">
          <div className="text-2xl text-red-500 mb-1"><FiXCircle /></div>
          <p className="text-xs text-gray-600 dark:text-gray-400">لغو شده</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{mockTodaySummary.cancelled}</p>
        </div>
      </div>

      {/* رویدادهای نزدیک */}
      <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 sm:p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">رویدادهای نزدیک</h2>
          <Link to="/organizer/events" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">مشاهده همه رویدادها →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-right text-sm">
            <thead className="bg-gray-50 dark:bg-[#111827] border-b border-blue-100 dark:border-gray-700/60">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">نام رویداد</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">تاریخ و زمان</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">تعداد ثبت‌نام</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">وضعیت پر شدن</th>
              </tr>
            </thead>
            <tbody>
              {mockUpcomingEvents.map(event => (
                <tr 
                  key={event.id} 
                  className="border-b border-blue-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition"
                  onClick={() => handleEventClick(event.id)}
                >
                  <td className="px-4 py-3 text-gray-800 dark:text-white">{event.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{event.date} - {event.time}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{event.registered} از {event.capacity}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${getProgressColor(event.fillPercent)}`} style={{ width: `${event.fillPercent}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{event.fillPercent}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* نمودار روند رزروها */}
      <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 sm:p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FiBarChart2 className="text-blue-600 dark:text-blue-400" size={20} />
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">روند رزروهای هفته جاری</h2>
        </div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockWeeklyReservations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
              <XAxis dataKey="day" stroke="#4B5563" className="dark:stroke-gray-400" />
              <YAxis stroke="#4B5563" className="dark:stroke-gray-400" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* نوبت‌های امروز */}
      <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 sm:p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            نوبت‌های امروز - {new Date().toLocaleDateString('fa-IR')}
          </h2>
          <Link to="/organizer/reservations" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">مشاهده همه →</Link>
        </div>
        {mockTodayAppointments.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">امروز نوبتی ندارید! وقت آزاد دارید.</div>
        ) : (
          <div className="divide-y divide-blue-100 dark:divide-gray-700/60">
            {mockTodayAppointments.map(app => (
              <div key={app.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{app.timeStart} – {app.timeEnd}</span>
                  <span className="text-gray-800 dark:text-white text-sm">{app.participantName}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{app.eventName}</span>
                </div>
                {app.status === 'upcoming' && (
                  <button 
                    onClick={() => handleCancelAppointment(app.id, app.participantName)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-xs font-bold transition"
                  >
                    <FiTrash2 size={14} /> لغو نوبت
                  </button>
                )}
                {app.status === 'past' && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">گذشته</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* آخرین پیام‌ها */}
      <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">آخرین پیام‌های ارسالی</h2>
          <Link to="/organizer/notifications" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">مشاهده همه →</Link>
        </div>
        <div className="divide-y divide-blue-100 dark:divide-gray-700/60">
          {mockRecentMessages.map(msg => (
            <div key={msg.id} className="flex flex-col sm:flex-row justify-between py-3 gap-1">
              <span className="text-gray-800 dark:text-white text-sm">{msg.title}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{msg.date} - ارسال به {msg.recipients} نفر</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
