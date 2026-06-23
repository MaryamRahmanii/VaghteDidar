import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './context/user-context';
import { bookingApi, notificationApi } from '../../services/api';

const Profile = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('آینده');
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showNewReserveModal, setShowNewReserveModal] = useState(false);
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [organizerId, setOrganizerId] = useState('');

  
  const [displayedNotifs, setDisplayedNotifs] = useState([]);
  const [showAllNotifs, setShowAllNotifs] = useState(false);

  const activeAppointments = appointments.filter(a => a.status === 'آینده');
  const activeAppointmentsCount = activeAppointments.length;
  const filteredAppointments = appointments.filter(a => a.status === activeTab);

  const fetchMyBookings = async () => {
    setIsLoading(true);
    try {
      const response = await bookingApi.get('/bookings/me');
      const formattedBookings = response.data.map(item => ({
        id: item.id,
        name: item.organizer_name || 'برگزار کننده',
        title: item.meeting_title || 'مشاوره',
        date: item.appointment_date || new Date(item.created_at).toLocaleDateString('fa-IR'),
        time: item.appointment_time || '',
        status: item.status === 'active' ? 'آینده' : (item.status === 'cancelled' ? 'لغو شده' : 'گذشته'),
        color: 'bg-blue-100'
      }));
      setAppointments(formattedBookings);
    } catch (error) {
      console.error("خطا در دریافت نوبت‌ها", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  const fetchNotifications = async () => {
    if (!userData?.phone_number) return;
    
    try {
      const response = await notificationApi.get(`/notifications/history?phone=${userData.phone_number}`);
      
      const formattedNotifs = response.data.map((item, index) => ({
        id: item.id || index,
        title: item.type === 'otp' ? 'پیامک سیستمی' : 'اعلان رزرو',
        desc: item.message_body,
        time: new Date(item.created_at).toLocaleString('fa-IR'),
        type: item.status === 'sent' ? 'success' : 'message',
        unread: index === 0 // فقط اعلان اول به صورت خوانده‌نشده نمایش داده می‌شود
      }));
      
      setDisplayedNotifs(formattedNotifs);
    } catch (error) {
      console.error("خطا در دریافت اعلان‌ها", error);
    }
  };

  const handleCancelAppointment = async (idToCancel) => {
    try {
      await bookingApi.delete(`/bookings/${idToCancel}`, { data: { reason: "توسط کاربر لغو شد" } });
      fetchMyBookings();
      setSelectedAppointmentDetails(null);
    } catch (error) {
      alert("خطا در لغو نوبت");
    }
  };

  const handleSearchOrganizer = (e) => {
    e.preventDefault();
    if (!organizerId.trim()) return;
    setShowNewReserveModal(false);
    navigate('/public-organizer-dashboard', { 
      state: { orgId: organizerId } 
    });
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  
  useEffect(() => {
    if (userData?.phone_number) {
      fetchNotifications();
    }
  }, [userData]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8" dir="rtl">
      
      {showLimitModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1f2937] border border-red-100 dark:border-red-900/50 p-6 rounded-2xl max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">سقف نوبت‌های فعال</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              شما در حال حاضر <span className="font-bold text-red-500">۲ نوبت فعال</span> دارید. برای ثبت رزرو جدید، ابتدا باید نوبت‌های قبلی خود را به اتمام برسانید یا آن‌ها را لغو کنید.
            </p>
            <button 
              onClick={() => setShowLimitModal(false)} 
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-2.5 text-sm font-bold transition-colors"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}

      {selectedAppointmentDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">جزئیات رزرو</h3>
            <div className="space-y-3 mb-6 text-sm text-gray-600 dark:text-gray-300">
              <p><strong className="text-gray-800 dark:text-gray-200">برگزار کننده:</strong> {selectedAppointmentDetails.name}</p>
              <p><strong className="text-gray-800 dark:text-gray-200">عنوان جلسه:</strong> {selectedAppointmentDetails.title}</p>
              <p><strong className="text-gray-800 dark:text-gray-200">زمان:</strong> {selectedAppointmentDetails.date}، {selectedAppointmentDetails.time}</p>
              <p><strong className="text-gray-800 dark:text-gray-200">محل برگزاری:</strong> آنلاین (Google Meet)</p>
              <p><strong className="text-gray-800 dark:text-gray-200">وضعیت:</strong> پرداخت شده</p>
            </div>
            <button 
              onClick={() => setSelectedAppointmentDetails(null)} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-bold transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      {showNewReserveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1f2937] border border-blue-100 dark:border-gray-700 p-6 sm:p-8 rounded-2xl max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">رزرو نوبت جدید</h3>
              <button onClick={() => setShowNewReserveModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              برای ثبت نوبت، شناسه (ID) اختصاصی شخص یا کسب‌و‌کار مورد نظر را وارد کنید.
            </p>
            <form onSubmit={handleSearchOrganizer} className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="مثال: dr_ahmadi" 
                  value={organizerId}
                  onChange={(e) => setOrganizerId(e.target.value)}
                  dir="ltr"
                  required
                  className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#2a3449] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left transition-colors"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 text-sm font-bold transition-colors"
              >
                جستجو و ادامه
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        <div className="xl:col-span-1 order-last xl:order-1 bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col h-fit">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-6 text-center sm:text-right">اعلان ها</h3>
          <div className="flex flex-col space-y-4">
            {displayedNotifs.length > 0 ? displayedNotifs.map((notif) => (
              <div key={notif.id} className="relative border border-blue-100 dark:border-gray-600 rounded-xl p-4 flex items-start gap-4 bg-white dark:bg-[#1f2937]">
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  notif.type === 'success' ? 'bg-green-100 dark:bg-green-900/40 text-green-500' :
                  notif.type === 'message' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-500' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-500'
                }`}>
                  {notif.type === 'success' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                  {notif.type === 'message' && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                    </svg>
                  )}
                  {notif.type !== 'success' && notif.type !== 'message' && (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                     </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-bold mb-1 ${
                    notif.type === 'success' ? 'text-green-500' :
                    notif.type === 'message' ? 'text-blue-500' :
                    'text-gray-700 dark:text-gray-300'
                  }`}>{notif.title}</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">{notif.desc}</p>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 block font-medium" dir="ltr">{notif.time}</span>
                </div>
                {notif.unread && <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
            )) : (
              <p className="text-center text-xs text-gray-500 py-4">اعلان جدیدی وجود ندارد.</p>
            )}
          </div>
          <div className="mt-6 flex justify-center w-full">
            <button onClick={() => setShowAllNotifs(!showAllNotifs)} className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full border border-blue-50 dark:border-gray-700 shadow-sm">
              {showAllNotifs ? 'بستن لیست اعلان‌ها' : 'مشاهده ی همه ی اعلان ها'}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 mr-1 transition-transform duration-300 ${showAllNotifs ? 'rotate-90' : ''}`}>
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.25-7.25a.75.75 0 0 0 0-1.5H8.66l2.1-1.95a.75.75 0 1 0-1.02-1.1l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 0 0 1.02-1.1l-2.1-1.95h4.59Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div className="xl:col-span-2 order-first xl:order-2 space-y-6">
          
          <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full sm:w-auto text-center sm:text-right">
              
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 overflow-hidden border-4 border-white dark:border-[#1a2235] shadow-md">
                {userData?.profile_photo_url ? (
                  <img src={`http://localhost:8001${userData.profile_photo_url}`} alt="آواتار" className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full text-gray-400 p-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                )}
              </div>

              <div className="space-y-1.5 pt-2">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{userData?.full_name || 'کاربر گرامی'}</h2>
                <div className="flex items-center justify-center sm:justify-start text-xs text-blue-500 dark:text-blue-400 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.265-3.965-6.861-6.861l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <span dir="ltr">{userData?.phone_number}</span>
                </div>
                <div className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full px-3 py-1.5 mt-2 text-[11px] font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {activeAppointmentsCount} نوبت فعال از ۲
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full sm:w-32 flex-shrink-0">
              <Link 
                to="/edit-profile" 
                className="w-full py-2 border-2 border-blue-400 text-blue-500 dark:text-blue-400 bg-white dark:bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-sm font-bold transition-colors text-center"
              >
                ویرایش پروفایل
              </Link>
              
              <button 
                onClick={() => {
                  if (activeAppointmentsCount >= 2) {
                    setShowLimitModal(true);
                  } else {
                    setShowNewReserveModal(true);
                  }
                }} 
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-500/30"
              >
                رزرو جدید
              </button>
            </div>
          </div>

          {activeAppointmentsCount > 0 && (
            <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700 rounded-2xl p-5 sm:p-6 shadow-sm transition-all duration-300">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                <h3 className="font-bold text-gray-800 dark:text-white">تایید رزرو</h3>
                <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                  تایید شده
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
              </div>

              <div className="space-y-6">
                {activeAppointments.map((appt, index) => (
                  <div key={appt.id} className={index !== activeAppointmentsCount - 1 ? "border-b border-gray-100 dark:border-gray-700 pb-6" : ""}>
                    
                    <div className="flex justify-between items-center text-center mb-6">
                      <div className="flex-1 space-y-2">
                        <span className="text-xs text-gray-800 dark:text-gray-200 font-bold block">برگزار کننده</span>
                        <div className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1.5 text-blue-600 dark:text-blue-400">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                          </svg>
                          {appt.name}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-2 border-x border-gray-200 dark:border-gray-700">
                        <span className="text-xs text-gray-800 dark:text-gray-200 font-bold block">عنوان</span>
                        <div className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1.5 text-blue-600 dark:text-blue-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                          </svg>
                          {appt.title}
                        </div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <span className="text-xs text-gray-800 dark:text-gray-200 font-bold block">زمان</span>
                        <div className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1.5 text-blue-600 dark:text-blue-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                          </svg>
                          {appt.date} {appt.time}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                      <button 
                        onClick={() => setSelectedAppointmentDetails(appt)} 
                        className="px-5 py-1.5 border-2 border-blue-400 text-blue-500 bg-white dark:bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-xs font-bold transition-colors"
                      >
                        مشاهده ی جزئیات
                      </button>
                      <button 
                        onClick={() => handleCancelAppointment(appt.id)} 
                        className="px-5 py-1.5 border-2 border-red-400 text-red-500 bg-white dark:bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-xs font-bold transition-colors"
                      >
                        لغو نوبت
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-[#1a2235] border border-blue-100 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 pb-0">
              <h3 className="font-bold text-gray-800 dark:text-white mb-6">نوبت های من</h3>
              <div className="flex justify-start gap-8 sm:gap-12 border-b border-blue-100 dark:border-gray-700 px-2">
                {['آینده', 'گذشته', 'لغو شده'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-bold transition-colors relative ${
                      activeTab === tab ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4 min-h-[160px] flex flex-col justify-center transition-all">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-transparent border-b border-gray-100 dark:border-gray-700/50 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${item.color} rounded-full overflow-hidden flex-shrink-0`}>
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-500 p-2 bg-blue-50 dark:bg-blue-900/30">
                           <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                         </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{item.title}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400 text-left min-w-[80px]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2 text-blue-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                      <div className="flex flex-col font-bold leading-tight">
                        <span>{item.date}</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 py-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-2 opacity-40 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 11.517 1.28l-.04.02A.75.75 0 0 1 11.25 11.25zM12 4.5c4.142 0 7.5 3.358 7.5 7.5s-3.358 7.5-7.5 7.5-7.5-3.358-7.5-7.5 3.358-7.5 7.5-7.5z" />
                  </svg>
                  <p className="text-xs sm:text-sm font-bold text-gray-400 dark:text-gray-500">نوبتی در این بخش وجود ندارد.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;