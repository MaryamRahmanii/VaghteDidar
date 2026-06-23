import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiSearch, FiDownload, FiSend, FiEye, FiTrash2, 
  FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';

// داده‌های mock
const mockReservations = [
  {
    id: 101,
    name: 'مریم احمدی',
    phone: '09121234567',
    eventId: 1,
    eventName: 'کارگاه مکالمه',
    date: '۱۴۰۲/۱۲/۱۰',
    time: '۱۰:۰۰',
    customFields: { job: 'مهندس نرم‌افزار', city: 'تهران' },
    status: 'upcoming',
  },
  {
    id: 102,
    name: 'علی کریمی',
    phone: '09351234567',
    eventId: 2,
    eventName: 'دوره گرامر پیشرفته',
    date: '۱۴۰۲/۱۲/۱۲',
    time: '۱۴:۰۰',
    customFields: { job: 'دانشجو', city: 'اصفهان' },
    status: 'upcoming',
  },
  {
    id: 103,
    name: 'سارا حسنی',
    phone: '09171234567',
    eventId: 4,
    eventName: 'تست تعیین سطح',
    date: '۱۴۰۲/۱۲/۱۵',
    time: '۰۹:۰۰',
    customFields: { job: 'معلم', city: 'شیراز' },
    status: 'past',
  },
  {
    id: 104,
    name: 'رضا محمدی',
    phone: '09301234567',
    eventId: 1,
    eventName: 'کارگاه مکالمه',
    date: '۱۴۰۲/۱۲/۱۱',
    time: '۱۱:۰۰',
    customFields: { job: 'برنامه‌نویس', city: 'مشهد' },
    status: 'cancelled',
  },
  {
    id: 105,
    name: 'زهرا کریمی',
    phone: '09199876543',
    eventId: 3,
    eventName: 'کارگاه رایتینگ آیلتس',
    date: '۱۴۰۲/۱۲/۱۸',
    time: '۱۶:۰۰',
    customFields: { job: 'مدرس زبان', city: 'تهران' },
    status: 'upcoming',
  },
];

const mockEvents = [
  { id: 1, name: 'کارگاه مکالمه' },
  { id: 2, name: 'دوره گرامر پیشرفته' },
  { id: 3, name: 'کارگاه رایتینگ آیلتس' },
  { id: 4, name: 'تست تعیین سطح' },
];

const Reservations = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEventId = searchParams.get('eventId') || 'all';
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(initialEventId);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    setTimeout(() => {
      setReservations(mockReservations);
      setLoading(false);
    }, 500);

    // بعداً که API آماده شد، این کد را فعال کنید:
    // const fetchReservations = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await bookingApi.get(`/organizer/events/${selectedEvent}/bookings`);
    //     setReservations(response.data);
    //   } catch (error) {
    //     console.error('خطا در دریافت رزروها:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // if (selectedEvent !== 'all') fetchReservations();
  }, [selectedEvent]);

  const filteredReservations = reservations.filter(r => {
    if (selectedEvent !== 'all' && r.eventId !== parseInt(selectedEvent)) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchText && !r.name.includes(searchText) && !r.phone.includes(searchText)) return false;
    if (dateRange.start && r.date < dateRange.start) return false;
    if (dateRange.end && r.date > dateRange.end) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const paginatedReservations = filteredReservations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectRow = (id) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedReservations.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedReservations.map(r => r.id));
    }
  };

  const handleCancel = (reservation) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    // TODO: اتصال به بک‌اند
    // await bookingApi.delete(`/organizer/bookings/${selectedReservation.id}`);
    setReservations(prev => prev.map(r =>
      r.id === selectedReservation.id ? { ...r, status: 'cancelled' } : r
    ));
    setShowCancelModal(false);
    setSelectedRows(prev => prev.filter(id => id !== selectedReservation.id));
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetailModal(true);
  };

  const handleExportExcel = () => {
    alert(`خروجی اکسل از ${filteredReservations.length} رزرو گرفته شد`);
  };

  const handleSendBulkMessage = () => {
    if (selectedRows.length === 0) return;
    alert(`ارسال پیام جمعی به ${selectedRows.length} نفر`);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#111827]">
        <div className="text-center text-gray-500 dark:text-gray-400">در حال بارگذاری رزروها...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-[#111827]">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">رزروها</h1>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-green-500/30"
          >
            <FiDownload size={18} /> خروجی Excel
          </button>
          <button 
            onClick={handleSendBulkMessage}
            disabled={selectedRows.length === 0}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
              selectedRows.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiSend size={18} /> ارسال پیام جمعی ({selectedRows.length})
          </button>
        </div>
      </div>

      {/* فیلترها */}
      <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 sm:p-5 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row flex-wrap gap-3 items-start md:items-center">
          <select 
            className="px-3 py-2 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option value="all">همه رویدادها</option>
            {mockEvents.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.name}</option>
            ))}
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
          <select 
            className="px-3 py-2 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="upcoming">آینده</option>
            <option value="past">گذشته</option>
            <option value="cancelled">لغو شده</option>
          </select>
          <div className="flex items-center flex-1 min-w-[200px] bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl px-3">
            <FiSearch className="text-gray-400 dark:text-gray-500 ml-2" />
            <input
              type="text"
              placeholder="جستجو در نام، تلفن..."
              className="w-full py-2 bg-transparent text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* جدول */}
      <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-right text-sm">
            <thead className="bg-gray-50 dark:bg-[#111827] border-b border-blue-100 dark:border-gray-700/60">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input 
                    type="checkbox"
                    checked={selectedRows.length === paginatedReservations.length && paginatedReservations.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">نام شرکت‌کننده</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">شماره تلفن</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">رویداد</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">تاریخ و ساعت</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">شغل</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">وضعیت</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400 w-24">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReservations.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500 dark:text-gray-400">هیچ رزروی یافت نشد</td>
                </tr>
              ) : (
                paginatedReservations.map(res => (
                  <tr key={res.id} className="border-b border-blue-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-4 py-3">
                      <input 
                        type="checkbox"
                        checked={selectedRows.includes(res.id)}
                        onChange={() => handleSelectRow(res.id)}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-white">{res.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{res.phone.slice(0, 4)}***{res.phone.slice(-4)}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{res.eventName}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{res.date} - {res.time}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{res.customFields?.job || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        res.status === 'upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                        res.status === 'past' ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' :
                        'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300'
                      }`}>
                        {res.status === 'upcoming' ? 'آینده' : res.status === 'past' ? 'گذشته' : 'لغو شده'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewDetails(res)}
                          className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                          title="جزئیات"
                        >
                          <FiEye size={18} />
                        </button>
                        {res.status === 'upcoming' && (
                          <button 
                            onClick={() => handleCancel(res)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="لغو نوبت"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
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

      {/* مودال جزئیات */}
      {showDetailModal && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white dark:bg-[#1a2235] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-blue-100 dark:border-gray-700/60" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b border-blue-100 dark:border-gray-700/60 pb-3">جزئیات نوبت</h3>
            <div className="space-y-3 text-sm">
              <p><span className="font-bold text-gray-600 dark:text-gray-400">نام:</span> {selectedReservation.name}</p>
              <p><span className="font-bold text-gray-600 dark:text-gray-400">تلفن:</span> {selectedReservation.phone}</p>
              <p><span className="font-bold text-gray-600 dark:text-gray-400">رویداد:</span> {selectedReservation.eventName}</p>
              <p><span className="font-bold text-gray-600 dark:text-gray-400">زمان:</span> {selectedReservation.date} - {selectedReservation.time}</p>
              <p><span className="font-bold text-gray-600 dark:text-gray-400">شهر:</span> {selectedReservation.customFields?.city || '-'}</p>
              <p><span className="font-bold text-gray-600 dark:text-gray-400">شغل:</span> {selectedReservation.customFields?.job || '-'}</p>
              <p><span className="font-bold text-gray-600 dark:text-gray-400">وضعیت:</span> {
                selectedReservation.status === 'upcoming' ? 'آینده' : selectedReservation.status === 'past' ? 'گذشته' : 'لغو شده'
              }</p>
            </div>
            <button 
              onClick={() => setShowDetailModal(false)}
              className="w-full mt-6 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      {/* مودال تأیید لغو */}
      {showCancelModal && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white dark:bg-[#1a2235] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-red-100 dark:border-red-900/50" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-red-500 dark:text-red-400 mb-3">لغو نوبت</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              آیا از لغو نوبت <span className="font-bold">{selectedReservation.name}</span> در تاریخ <span className="font-bold">{selectedReservation.date}</span> مطمئن هستید؟
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">پیام اطلاع‌رسانی به کاربر ارسال خواهد شد.</p>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={confirmCancel}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition"
              >
                بله، لغو شود
              </button>
              <button 
                onClick={() => setShowCancelModal(false)}
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

export default Reservations;
