import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiSearch, FiPlus, FiEye, FiEdit2, FiCopy, FiTrash2, 
  FiChevronLeft, FiChevronRight, FiCalendar 
} from 'react-icons/fi';

// داده‌های mock
const mockEvents = [
  {
    id: 1,
    title: 'کارگاه مکالمه',
    startDate: '۱۴۰۲/۱۲/۱۰',
    endDate: '۱۴۰۲/۱۲/۱۵',
    totalSlots: 20,
    reservedCount: 15,
    createdAt: '۱۴۰۲/۱۱/۲۰',
    status: 'active',
  },
  {
    id: 2,
    title: 'دوره گرامر پیشرفته',
    startDate: '۱۴۰۲/۱۲/۱۲',
    endDate: '۱۴۰۲/۱۲/۲۵',
    totalSlots: 15,
    reservedCount: 8,
    createdAt: '۱۴۰۲/۱۱/۲۵',
    status: 'active',
  },
  {
    id: 3,
    title: 'کارگاه رایتینگ آیلتس',
    startDate: '۱۴۰۲/۱۲/۲۰',
    endDate: '۱۴۰۲/۱۲/۲۲',
    totalSlots: 30,
    reservedCount: 20,
    createdAt: '۱۴۰۲/۱۲/۰۱',
    status: 'draft',
  },
  {
    id: 4,
    title: 'تست تعیین سطح',
    startDate: '۱۴۰۲/۱۲/۰۵',
    endDate: '۱۴۰۲/۱۲/۰۵',
    totalSlots: 40,
    reservedCount: 25,
    createdAt: '۱۴۰۲/۱۱/۱۰',
    status: 'inactive',
  },
  {
    id: 5,
    title: 'وبینار تکنیک‌های مصاحبه',
    startDate: '۱۴۰۳/۰۱/۱۰',
    endDate: '۱۴۰۳/۰۱/۱۰',
    totalSlots: 100,
    reservedCount: 45,
    createdAt: '۱۴۰۲/۱۲/۱۵',
    status: 'active',
  },
];

const EventList = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 500);

    // بعداً که API آماده شد، این کد را فعال کنید:
    // const fetchEvents = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await bookingApi.get('/organizer/events');
    //     setEvents(response.data);
    //   } catch (error) {
    //     console.error('خطا در دریافت رویدادها:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    if (statusFilter !== 'all' && event.status !== statusFilter) return false;
    if (searchText && !event.title.includes(searchText)) return false;
    if (dateRange.start && event.startDate < dateRange.start) return false;
    if (dateRange.end && event.endDate > dateRange.end) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleViewReservations = (eventId) => {
    navigate(`/organizer/reservations?eventId=${eventId}`);
  };

  const handleEdit = (eventId) => {
    navigate(`/organizer/events/edit/${eventId}`);
  };

  const handleCopy = (event) => {
    alert(`کپی رویداد "${event.title}" در حال انجام...`);
  };

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    // TODO: اتصال به بک‌اند
    // await bookingApi.delete(`/organizer/events/${selectedEvent.id}`);
    setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
    setShowDeleteModal(false);
    setSelectedEvent(null);
    if (paginatedEvents.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return { text: 'فعال', class: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' };
      case 'inactive': return { text: 'غیرفعال', class: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' };
      case 'draft': return { text: 'پیش‌نویس', class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' };
      default: return { text: 'نامشخص', class: 'bg-gray-100 text-gray-600' };
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#111827]">
        <div className="text-center text-gray-500 dark:text-gray-400">در حال بارگذاری رویدادها...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-[#111827]">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">لیست رویدادها</h1>
        <Link 
          to="/organizer/events/create" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-blue-500/30"
        >
          <FiPlus size={18} />
          رویداد جدید
        </Link>
      </div>

      {/* فیلترها */}
      <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 sm:p-5 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row flex-wrap gap-3 items-start md:items-center">
          <div className="flex items-center flex-1 min-w-[200px] bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl px-3">
            <FiSearch className="text-gray-400 dark:text-gray-500 ml-2" />
            <input
              type="text"
              placeholder="جستجوی عنوان رویداد..."
              className="w-full py-2 bg-transparent text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <select 
            className="px-3 py-2 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
            <option value="draft">پیش‌نویس</option>
          </select>
          <input
            type="text"
            placeholder="از تاریخ"
            className="px-3 py-2 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <input
            type="text"
            placeholder="تا تاریخ"
            className="px-3 py-2 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
      </div>

      {/* جدول */}
      <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-right text-sm">
            <thead className="bg-gray-50 dark:bg-[#111827] border-b border-blue-100 dark:border-gray-700/60">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">عنوان رویداد</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">بازه تاریخ</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">نوبت‌ها (رزرو/کل)</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">تاریخ ایجاد</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">وضعیت</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400 w-32">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500 dark:text-gray-400">هیچ رویدادی یافت نشد</td>
                </tr>
              ) : (
                paginatedEvents.map(event => {
                  const statusInfo = getStatusBadge(event.status);
                  return (
                    <tr key={event.id} className="border-b border-blue-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="px-4 py-3 text-gray-800 dark:text-white font-medium">{event.title}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <FiCalendar size={14} />
                          <span>{event.startDate} تا {event.endDate}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        <span className="font-bold text-blue-600 dark:text-blue-400">{event.reservedCount}</span>
                        <span className="mx-1">/</span>
                        <span>{event.totalSlots}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{event.createdAt}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusInfo.class}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleViewReservations(event.id)}
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                            title="مشاهده رزروها"
                          >
                            <FiEye size={18} />
                          </button>
                          <button 
                            onClick={() => handleEdit(event.id)}
                            className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                            title="ویرایش"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleCopy(event)}
                            className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                            title="کپی"
                          >
                            <FiCopy size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(event)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="حذف"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* صفحه‌بندی */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
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

      {/* مودال تأیید حذف */}
      {showDeleteModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white dark:bg-[#1a2235] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-red-100 dark:border-red-900/50" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-red-500 dark:text-red-400 mb-3">حذف رویداد</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              آیا از حذف رویداد <span className="font-bold">"{selectedEvent.title}"</span> مطمئن هستید؟
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">تمامی نوبت‌ها و رزروهای مرتبط با این رویداد نیز حذف خواهند شد.</p>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition"
              >
                بله، حذف شود
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold transition"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
