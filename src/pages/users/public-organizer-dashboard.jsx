import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const PublicOrganizerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

 
  const orgId = location.state?.orgId || '';

  const monthsData = [
    { name: 'خرداد ۱۴۰۳', days: 31, startOffset: 3 },
    { name: 'تیر ۱۴۰۳', days: 31, startOffset: 6 },
    { name: 'مرداد ۱۴۰۳', days: 31, startOffset: 1 },
  ];

  const daysOfWeek = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);
  const [selectedDate, setSelectedDate] = useState({ month: 0, day: 15 });
  const [selectedTime, setSelectedTime] = useState(null); 
  const [availableSlots, setAvailableSlots] = useState([]);
  const [duration, setDuration] = useState('۱ ساعت');
  
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrevMonth = () => {
    if (currentMonthIdx > 0) setCurrentMonthIdx(currentMonthIdx - 1);
  };
  
  const handleNextMonth = () => {
    if (currentMonthIdx < monthsData.length - 1) setCurrentMonthIdx(currentMonthIdx + 1);
  };

  
  useEffect(() => {
   

    const allTimes = [
      { id: '11111111-1111-1111-1111-111111111111', time: '۰۹:۰۰' },
      { id: '22222222-2222-2222-2222-222222222222', time: '۱۰:۰۰' },
      { id: '33333333-3333-3333-3333-333333333333', time: '۱۱:۰۰' },
      { id: '44444444-4444-4444-4444-444444444444', time: '۱۵:۰۰' },
      { id: '55555555-5555-5555-5555-555555555555', time: '۱۸:۰۰' },
      { id: '66666666-6666-6666-6666-666666666666', time: '۱۹:۰۰' }
    ];
    const generatedSlots = allTimes.map((slot, index) => {
      const isFull = (selectedDate.day * 3 + index) % 5 === 0;
      return { ...slot, isAvailable: !isFull };
    });
    setAvailableSlots(generatedSlots);
    setSelectedTime(null);
  }, [selectedDate]);

 
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTime) return;

    setIsLoading(true);

    try {
      
    

      setShowSuccessAlert(true);

      setTimeout(() => {
        navigate('/profile', { 
          state: { 
            newBooking: {
              id: Date.now(),
              name: 'مهندس فلان فلانی', 
              spec: 'مشاور کسب و کار',
              title: 'مشاوره اختصاصی',
              date: `${selectedDate.day} ${monthsData[currentMonthIdx].name.split(' ')[0]}`,
              time: `ساعت ${selectedTime.time}`,
              status: 'آینده',
              color: 'bg-indigo-100',
              seed: 'Felix'
            }
          } 
        });
      }, 2000);

    } catch (error) {
      console.error(error);
      alert('خطا در ارتباط با سرور. این زمان قابل رزرو نیست.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentMonth = monthsData[currentMonthIdx];
  const emptyCells = Array.from({ length: currentMonth.startOffset }, (_, i) => i);
  const monthDates = Array.from({ length: currentMonth.days }, (_, i) => i + 1);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 animate-fade-in relative" dir="rtl">
      
      
      {showSuccessAlert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-green-50 dark:bg-green-900/90 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-6 py-4 rounded-2xl shadow-xl animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-bold text-sm">درخواست رزرو با موفقیت ارسال شد!</span>
        </div>
      )}

      <div className="w-full max-w-2xl mx-auto space-y-6">
        
        {/* ================= کارت ۱: پروفایل برگزارکننده ================= */}
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-right">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-pink-500 border-4 border-white dark:border-[#1a2235] shadow-md flex-shrink-0 relative">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&backgroundColor=transparent" alt="آواتار" className="w-full h-full object-cover scale-110 mt-2" />
            </div>
            <div className="space-y-3 pt-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">مهندس فلان فلانی</h1>
              <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400">مشاور کسب و کار و رشد استارتاپ ها</h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-justify sm:text-right">
                بیش از ۱۰ سال سابقه در زمینه مشاوره و راهبری کسب و کارهای نوین و استارتاپ های فناورانه، ارائه راهکارهای عملی برای حل مشکلات و توسعه بیزینس مدل.
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-gray-700/60 my-6"></div>

          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 text-xs font-bold text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              <span>بیش از ۱۰۰ جلسه موفق</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
              <span>پاسخگویی سریع</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <span>مشاوره ویدیویی اختصاصی</span>
            </div>
          </div>
        </div>

        {/* ================= کارت ۲: تقویم پویا ================= */}
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <button 
              type="button"
              onClick={handlePrevMonth} 
              disabled={currentMonthIdx === 0}
              className={`transition-colors ${currentMonthIdx === 0 ? 'text-gray-200 dark:text-gray-700 cursor-not-allowed' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
            <h3 className="font-bold text-sm text-gray-800 dark:text-white">{currentMonth.name}</h3>
            <button 
              type="button"
              onClick={handleNextMonth} 
              disabled={currentMonthIdx === monthsData.length - 1}
              className={`transition-colors ${currentMonthIdx === monthsData.length - 1 ? 'text-gray-200 dark:text-gray-700 cursor-not-allowed' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs mb-4 font-bold text-gray-500 dark:text-gray-400">
            {daysOfWeek.map(day => <span key={day}>{day}</span>)}
          </div>

          <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
            {emptyCells.map(cell => <div key={`empty-${cell}`}></div>)}
            {monthDates.map(date => {
              const isSelected = selectedDate.month === currentMonthIdx && selectedDate.day === date;
              return (
                <button
                  type="button"
                  key={date}
                  onClick={() => setSelectedDate({ month: currentMonthIdx, day: date })}
                  className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto flex items-center justify-center rounded-full transition-all ${
                    isSelected 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40' 
                      : 'hover:bg-blue-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {date}
                </button>
              );
            })}
          </div>
        </div>

       
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-3xl p-6 sm:p-8 shadow-sm transition-all">
          <h3 className="font-bold text-sm text-gray-800 dark:text-white mb-6 text-center sm:text-right">
            ساعات موجود در {selectedDate.day} {monthsData[selectedDate.month].name.split(' ')[0]}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {availableSlots.map((slot, index) => {
              const isSelected = selectedTime?.id === slot.id;
              const availableClasses = "border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:border-blue-400 dark:hover:border-gray-400 bg-white dark:bg-[#1f2937] cursor-pointer";
              const fullClasses = "border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-[#111827] cursor-not-allowed opacity-60";
              const activeClasses = "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-500 ring-1 ring-blue-500";

              return (
                <button
                  type="button"
                  key={index}
                  disabled={!slot.isAvailable}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                    slot.isAvailable 
                      ? (isSelected ? activeClasses : availableClasses) 
                      : fullClasses
                  }`}
                >
                  {slot.time}
                </button>
              )
            })}
          </div>
        </div>

        
        <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700/60 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-center sm:justify-start gap-2 border-b border-gray-100 dark:border-gray-700/60 pb-4 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <h3 className="font-bold text-gray-800 dark:text-white">اطلاعات رزرو</h3>
          </div>

          <form className="space-y-5" onSubmit={handleBookingSubmit}>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">نام و نام خانوادگی</label>
              <input type="text" required className="w-full bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">ایمیل</label>
              <input type="email" dir="ltr" className="w-full bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">شماره تلفن همراه</label>
              <input type="tel" dir="ltr" required className="w-full bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">نوع مشاوره</label>
                <select className="w-full bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none">
                  <option>انتخاب کنید</option>
                  <option>مشاوره آنلاین (تصویری)</option>
                  <option>مشاوره تلفنی</option>
                  <option>مشاوره حضوری</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">مدت زمان جلسه</label>
                <input 
                  type="text" 
                  list="durations"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="انتخاب یا تایپ کنید..."
                  className="w-full bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                />
                <datalist id="durations">
                  <option value="۳۰ دقیقه" />
                  <option value="۱ ساعت" />
                  <option value="۱ ساعت و ۳۰ دقیقه" />
                  <option value="۲ ساعت" />
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">توضیحات و سوالات (اختیاری)</label>
              <textarea rows="4" className="w-full bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"></textarea>
            </div>

            <div className="flex justify-center pt-6">
              <button 
                type="submit" 
                disabled={!selectedTime || isLoading || showSuccessAlert}
                className={`w-full sm:w-auto px-16 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg ${
                  selectedTime && !showSuccessAlert
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {isLoading ? 'در حال ارسال...' : (showSuccessAlert ? 'در حال انتقال...' : 'تایید و رزرو وقت')}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default PublicOrganizerDashboard;