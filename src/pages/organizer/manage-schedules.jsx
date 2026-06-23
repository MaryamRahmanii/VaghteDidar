import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiCalendar, FiClock, FiPlus, FiTrash2, FiChevronLeft, 
  FiChevronRight, FiCheckCircle, FiXCircle, FiClock as FiPending 
} from 'react-icons/fi';

// داده‌های mock
const mockEvent = {
  id: 1,
  title: 'کارگاه مکالمه',
  sessionDurationMinutes: 30,
};

const mockSlots = [
  { id: 1, startTime: '۱۴۰۲/۱۲/۱۰ ۱۰:۰۰', endTime: '۱۴۰۲/۱۲/۱۰ ۱۰:۳۰', status: 'available' },
  { id: 2, startTime: '۱۴۰۲/۱۲/۱۰ ۱۰:۳۰', endTime: '۱۴۰۲/۱۲/۱۰ ۱۱:۰۰', status: 'booked' },
  { id: 3, startTime: '۱۴۰۲/۱۲/۱۰ ۱۱:۰۰', endTime: '۱۴۰۲/۱۲/۱۰ ۱۱:۳۰', status: 'available' },
  { id: 4, startTime: '۱۴۰۲/۱۲/۱۰ ۱۱:۳۰', endTime: '۱۴۰۲/۱۲/۱۰ ۱۲:۰۰', status: 'cancelled' },
  { id: 5, startTime: '۱۴۰۲/۱۲/۱۱ ۰۹:۰۰', endTime: '۱۴۰۲/۱۲/۱۱ ۰۹:۳۰', status: 'available' },
  { id: 6, startTime: '۱۴۰۲/۱۲/۱۱ ۰۹:۳۰', endTime: '۱۴۰۲/۱۲/۱۱ ۱۰:۰۰', status: 'available' },
];

const ManageSchedules = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: '', fromTime: '09:00', toTime: '10:00' });

  useEffect(() => {
    setTimeout(() => {
      setEvent(mockEvent);
      setSlots(mockSlots);
      setLoading(false);
    }, 500);

    // بعداً که API آماده شد، این کد را فعال کنید:
    // const fetchData = async () => {
    //   try {
    //     const [eventRes, slotsRes] = await Promise.all([
    //       bookingApi.get(`/events/${eventId}`),
    //       bookingApi.get(`/events/${eventId}/slots`),
    //     ]);
    //     setEvent(eventRes.data);
    //     setSlots(slotsRes.data);
    //   } catch (error) {
    //     console.error('خطا در دریافت داده‌ها:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();
  }, [eventId]);

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('آیا از حذف این زمان مطمئن هستید؟')) return;
    // TODO: اتصال به بک‌اند
    // await bookingApi.delete(`/organizer/slots/${slotId}`);
    setSlots(slots.filter(s => s.id !== slotId));
  };

  const handleAddSlot = async () => {
    // TODO: اتصال به بک‌اند
    // const payload = {
    //   event_id: eventId,
    //   available_windows: [{
    //     date: newSlot.date,
    //     from_time: newSlot.fromTime,
    //     to_time: newSlot.toTime,
    //   }],
    // };
    // await bookingApi.post('/organizer/slots', payload);
    
    const newSlotObj = {
      id: Date.now(),
      startTime: `${newSlot.date} ${newSlot.fromTime}`,
      endTime: `${newSlot.date} ${newSlot.toTime}`,
      status: 'available',
    };
    setSlots([...slots, newSlotObj]);
    setShowAddModal(false);
    setNewSlot({ date: '', fromTime: '09:00', toTime: '10:00' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available': return { text: 'خالی', class: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', icon: <FiCheckCircle className="inline ml-1" size={14} /> };
      case 'booked': return { text: 'پر', class: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', icon: <FiXCircle className="inline ml-1" size={14} /> };
      case 'cancelled': return { text: 'لغو شده', class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', icon: <FiPending className="inline ml-1" size={14} /> };
      default: return { text: 'نامشخص', class: 'bg-gray-100 text-gray-600' };
    }
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
      {/* هدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/organizer/events" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              ← بازگشت به لیست رویدادها
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">مدیریت زمان‌بندی</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{event?.title} - هر نشست {event?.sessionDurationMinutes} دقیقه</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-blue-500/30"
        >
          <FiPlus size={18} /> افزودن زمان جدید
        </button>
      </div>

      {/* فیلتر تاریخ */}
      <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-4 sm:p-5 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">فیلتر بر اساس تاریخ:</label>
          <input
            type="text"
            placeholder="مثال: ۱۴۰۲/۱۲/۱۰"
            className="px-3 py-2 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button
            onClick={() => setSelectedDate('')}
            className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            پاک کردن فیلتر
          </button>
        </div>
      </div>

      {/* لیست زمان‌ها */}
      <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-right text-sm">
            <thead className="bg-gray-50 dark:bg-[#111827] border-b border-blue-100 dark:border-gray-700/60">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">تاریخ و ساعت شروع</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">تاریخ و ساعت پایان</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">وضعیت</th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400 w-24">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {slots.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500 dark:text-gray-400">هیچ زمانی تعریف نشده است.</td>
                </tr>
              ) : (
                slots
                  .filter(s => !selectedDate || s.startTime.includes(selectedDate))
                  .map(slot => {
                    const statusInfo = getStatusBadge(slot.status);
                    return (
                      <tr key={slot.id} className="border-b border-blue-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                        <td className="px-4 py-3 text-gray-800 dark:text-white">{slot.startTime}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{slot.endTime}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusInfo.class}`}>
                            {statusInfo.icon} {statusInfo.text}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {slot.status === 'available' && (
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                              title="حذف زمان"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          )}
                          {slot.status !== 'available' && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">غیرقابل حذف</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* مودال افزودن زمان */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-white dark:bg-[#1a2235] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-blue-100 dark:border-gray-700/60" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">افزودن زمان جدید</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">تاریخ</label>
                <input
                  type="text"
                  placeholder="مثال: ۱۴۰۲/۱۲/۱۰"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">از ساعت</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newSlot.fromTime}
                    onChange={(e) => setNewSlot({ ...newSlot, fromTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">تا ساعت</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newSlot.toTime}
                    onChange={(e) => setNewSlot({ ...newSlot, toTime: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddSlot}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition"
              >
                افزودن
              </button>
              <button
                onClick={() => setShowAddModal(false)}
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

export default ManageSchedules;
