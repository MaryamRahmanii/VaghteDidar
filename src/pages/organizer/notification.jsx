import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiSend, FiMessageCircle, FiUsers, FiCalendar, 
  FiClock, FiCheckCircle, FiXCircle, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';

// داده‌های mock
const mockEvents = [
  { id: 1, name: 'کارگاه مکالمه' },
  { id: 2, name: 'دوره گرامر پیشرفته' },
  { id: 3, name: 'کارگاه رایتینگ آیلتس' },
];

const mockHistory = [
  { id: 1, title: 'یادآوری جلسه فردا', date: '۱۴۰۲/۱۲/۰۷', recipients: 12, status: 'sent' },
  { id: 2, title: 'لغو نوبت به دلیل تعطیلی', date: '۱۴۰۲/۱۲/۰۶', recipients: 1, status: 'sent' },
  { id: 3, title: 'تغییر ساعت جلسه', date: '۱۴۰۲/۱۲/۰۵', recipients: 8, status: 'failed' },
  { id: 4, title: 'اطلاعیه ثبت‌نام', date: '۱۴۰۲/۱۲/۰۴', recipients: 25, status: 'sent' },
];

const Notifications = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [sendType, setSendType] = useState('all'); // all, specific
  const [specificPhone, setSpecificPhone] = useState('');
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setTimeout(() => {
      setHistory(mockHistory);
      setLoading(false);
    }, 500);

    // بعداً که API آماده شد، این کد را فعال کنید:
    // const fetchHistory = async () => {
    //   try {
    //     const response = await bookingApi.get('/notifications/history');
    //     setHistory(response.data);
    //   } catch (error) {
    //     console.error('خطا در دریافت تاریخچه:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchHistory();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageTitle || !messageBody) {
      alert('لطفاً عنوان و متن پیام را وارد کنید.');
      return;
    }

    // TODO: اتصال به بک‌اند
    // const payload = {
    //   event_id: selectedEvent,
    //   message_body: messageBody,
    // };
    // await bookingApi.post('/organizer/notifications/send', payload);

    const newHistory = {
      id: Date.now(),
      title: messageTitle,
      date: new Date().toLocaleDateString('fa-IR'),
      recipients: selectedEvent ? mockEvents.find(e => e.id === parseInt(selectedEvent))?.name : 'همه',
      status: 'sent',
    };
    setHistory([newHistory, ...history]);
    setMessageTitle('');
    setMessageBody('');
    setSelectedEvent('');
    alert('پیام با موفقیت ارسال شد!');
  };

  const getStatusBadge = (status) => {
    if (status === 'sent') return { text: 'موفق', class: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' };
    return { text: 'ناموفق', class: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' };
  };

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedHistory = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#111827]">
        <div className="text-gray-500 dark:text-gray-400">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-[#111827]">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">اعلان‌ها و پیام‌ها</h1>

      {/* بخش ارسال پیام */}
      <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">ارسال پیام جدید</h2>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">نوع ارسال</label>
              <select
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sendType}
                onChange={(e) => setSendType(e.target.value)}
              >
                <option value="all">همه شرکت‌کنندگان یک رویداد</option>
                <option value="specific">یک نوبت خاص (با شماره تلفن)</option>
              </select>
            </div>
            {sendType === 'all' ? (
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">انتخاب رویداد</label>
                <select
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  <option value="">انتخاب کنید...</option>
                  {mockEvents.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">شماره تلفن گیرنده</label>
                <input
                  type="text"
                  placeholder="مثال: ۰۹۱۲۱۲۳۴۵۶۷"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={specificPhone}
                  onChange={(e) => setSpecificPhone(e.target.value)}
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">عنوان پیام</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={messageTitle}
              onChange={(e) => setMessageTitle(e.target.value)}
              placeholder="مثال: یادآوری جلسه فردا"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">متن پیام</label>
            <textarea
              rows="4"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder="متن پیام را وارد کنید..."
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-blue-500/30"
            >
              <FiSend size={18} /> ارسال پیام
            </button>
          </div>
        </form>
      </div>

      {/* تاریخچه پیام‌ها */}
      <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">تاریخچه پیام‌ها</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full text-right text-sm">
            <thead className="bg-gray-50 dark:bg-[#111827] border-b border-blue-100 dark:border-gray-700/60">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">عنوان</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">تاریخ ارسال</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">مخاطب</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500 dark:text-gray-400">هیچ پیامی ارسال نشده است.</td>
                </tr>
              ) : (
                paginatedHistory.map(item => {
                  const statusInfo = getStatusBadge(item.status);
                  return (
                    <tr key={item.id} className="border-b border-blue-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="px-4 py-3 text-gray-800 dark:text-white">{item.title}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.date}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.recipients}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusInfo.class}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition ${
                currentPage === 1 
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              <FiChevronRight size={20} />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">صفحه {currentPage} از {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition ${
                currentPage === totalPages 
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
            >
              <FiChevronLeft size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
