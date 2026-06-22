import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';

const CreateEvent = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    sessionDurationMinutes: 30,
    isActive: true,
  });

  const [customFields, setCustomFields] = useState([
    { id: 1, field_label: 'نام و نام خانوادگی', field_type: 'text', is_required: true },
    { id: 2, field_label: 'شماره تلفن', field_type: 'text', is_required: true },
  ]);

  const [timeWindows, setTimeWindows] = useState([
    { id: 1, date: '', from_time: '09:00', to_time: '12:00' },
    { id: 2, date: '', from_time: '14:00', to_time: '17:00' },
  ]);

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      { id: Date.now(), field_label: '', field_type: 'text', is_required: false }
    ]);
  };

  const removeCustomField = (id) => {
    if (customFields.length <= 2) {
      alert('حداقل دو فیلد (نام و تلفن) الزامی است.');
      return;
    }
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const updateCustomField = (id, key, value) => {
    setCustomFields(customFields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const addTimeWindow = () => {
    setTimeWindows([
      ...timeWindows,
      { id: Date.now(), date: '', from_time: '09:00', to_time: '17:00' }
    ]);
  };

  const removeTimeWindow = (id) => {
    if (timeWindows.length <= 1) {
      alert('حداقل یک بازه زمانی باید تعریف شود.');
      return;
    }
    setTimeWindows(timeWindows.filter(w => w.id !== id));
  };

  const updateTimeWindow = (id, key, value) => {
    setTimeWindows(timeWindows.map(w => w.id === id ? { ...w, [key]: value } : w));
  };

  const handleSubmit = async (e, status = 'active') => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      event: {
        title: eventData.title,
        description: eventData.description,
        session_duration_minutes: eventData.sessionDurationMinutes,
      },
      custom_fields: customFields.map(f => ({
        field_label: f.field_label,
        field_type: f.field_type,
        is_required: f.is_required,
      })),
    };

    try {
      // TODO: اتصال به بک‌اند
      // const response = await bookingApi.post('/organizer/events', payload);
      // const eventId = response.data.id;
      // const slotsPayload = {
      //   event_id: eventId,
      //   available_windows: timeWindows.map(w => ({
      //     date: w.date,
      //     from_time: w.from_time,
      //     to_time: w.to_time,
      //   })),
      // };
      // await bookingApi.post('/organizer/slots', slotsPayload);

      console.log('داده ارسال شده:', payload);
      console.log('زمان‌ها:', timeWindows);
      
      alert(`رویداد با موفقیت ${status === 'active' ? 'منتشر' : 'به عنوان پیش‌نویس ذخیره'} شد!`);
      navigate('/organizer/events');
    } catch (error) {
      console.error('خطا:', error);
      alert('خطا در ایجاد رویداد. لطفاً مجدداً تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen bg-gray-50 dark:bg-[#111827]">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">ایجاد رویداد جدید</h1>
        <Link 
          to="/organizer/events" 
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← بازگشت به لیست
        </Link>
      </div>

      <form onSubmit={(e) => handleSubmit(e, 'active')} className="space-y-6">
        {/* بخش ۱: اطلاعات پایه */}
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">اطلاعات پایه</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                عنوان رویداد <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="مثال: کارگاه مکالمه"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                توضیحات (اختیاری)
              </label>
              <textarea
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                placeholder="توضیحات رویداد..."
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                مدت زمان هر نشست (دقیقه) <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={eventData.sessionDurationMinutes}
                onChange={(e) => setEventData({ ...eventData, sessionDurationMinutes: parseInt(e.target.value) })}
              >
                <option value="15">۱۵ دقیقه</option>
                <option value="30">۳۰ دقیقه</option>
                <option value="45">۴۵ دقیقه</option>
                <option value="60">۱ ساعت</option>
                <option value="90">۱.۵ ساعت</option>
                <option value="120">۲ ساعت</option>
              </select>
            </div>
          </div>
        </div>

        {/* بخش ۲: تنظیمات زمان‌بندی */}
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">زمان‌های در دسترس</h2>
            <button
              type="button"
              onClick={addTimeWindow}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
            >
              <FiPlus size={16} /> افزودن بازه
            </button>
          </div>
          <div className="space-y-4">
            {timeWindows.map((window) => (
              <div key={window.id} className="flex flex-wrap items-center gap-3 bg-gray-50 dark:bg-[#111827] p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">تاریخ</label>
                  <input
                    type="text"
                    placeholder="۱۴۰۲/۱۲/۱۰"
                    className="w-full px-3 py-2 bg-white dark:bg-[#1a2235] border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={window.date}
                    onChange={(e) => updateTimeWindow(window.id, 'date', e.target.value)}
                  />
                </div>
                <div className="flex-1 min-w-[100px]">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">از ساعت</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 bg-white dark:bg-[#1a2235] border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={window.from_time}
                    onChange={(e) => updateTimeWindow(window.id, 'from_time', e.target.value)}
                  />
                </div>
                <div className="flex-1 min-w-[100px]">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">تا ساعت</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 bg-white dark:bg-[#1a2235] border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={window.to_time}
                    onChange={(e) => updateTimeWindow(window.id, 'to_time', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeTimeWindow(window.id)}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* بخش ۳: فیلدهای سفارشی */}
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">فیلدهای سفارشی فرم</h2>
            <button
              type="button"
              onClick={addCustomField}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
            >
              <FiPlus size={16} /> افزودن فیلد
            </button>
          </div>
          <div className="space-y-4">
            {customFields.map((field) => (
              <div key={field.id} className="flex flex-wrap items-center gap-3 bg-gray-50 dark:bg-[#111827] p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex-1 min-w-[120px]">
                  <input
                    type="text"
                    placeholder="عنوان فیلد"
                    className="w-full px-3 py-2 bg-white dark:bg-[#1a2235] border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={field.field_label}
                    onChange={(e) => updateCustomField(field.id, 'field_label', e.target.value)}
                  />
                </div>
                <div className="min-w-[120px]">
                  <select
                    className="w-full px-3 py-2 bg-white dark:bg-[#1a2235] border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={field.field_type}
                    onChange={(e) => updateCustomField(field.id, 'field_type', e.target.value)}
                  >
                    <option value="text">متن</option>
                    <option value="textarea">متن بلند</option>
                    <option value="number">عدد</option>
                    <option value="phone">شماره تلفن</option>
                    <option value="email">ایمیل</option>
                    <option value="select">انتخابی</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 min-w-[80px]">
                  <label className="text-xs text-gray-600 dark:text-gray-400">اجباری</label>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
                    checked={field.is_required}
                    onChange={(e) => updateCustomField(field.id, 'is_required', e.target.checked)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomField(field.id)}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* دکمه‌های اقدام */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={loading}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            {loading ? 'در حال ذخیره...' : 'ذخیره به عنوان پیش‌نویس'}
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition shadow-lg flex items-center justify-center gap-2 ${
              loading 
                ? 'bg-blue-400 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
            }`}
          >
            <FiSave size={18} />
            {loading ? 'در حال انتشار...' : 'انتشار رویداد'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
