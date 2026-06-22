// src/services/adminService.js
import { bookingApi, iamApi } from './api';

// ===== آمار =====
export const fetchStats = async () => {
    // TODO: وقتی بک‌اند آماده شد، این بخش را با درخواست واقعی جایگزین کنید
    return [
        { label: 'کل کاربران', value: 1248 },
        { label: 'برگزارکنندگان', value: 56 },
        { label: 'رویدادهای فعال', value: 23 },
        { label: 'نوبت‌های امروز', value: 142 },
    ];
};

// ===== مدیریت کاربران عادی =====
export const fetchUsers = async () => {
    // TODO: اتصال به API واقعی
    return [
        { id: 1, name: 'مریم احمدی', phone: '۰۹۱۲۱۲۳۴۵۶۷', activeBookings: 2, lastBooking: '۱۴۰۲/۱۲/۲۰', status: 'active' },
        { id: 2, name: 'علی کریمی', phone: '۰۹۳۵۱۲۳۴۵۶۷', activeBookings: 0, lastBooking: '۱۴۰۲/۱۲/۱۵', status: 'active' },
        { id: 3, name: 'سارا حسنی', phone: '۰۹۱۷۱۲۳۴۵۶۷', activeBookings: 1, lastBooking: '۱۴۰۲/۱۲/۲۲', status: 'blocked' },
        { id: 4, name: 'رضا محمدی', phone: '۰۹۳۰۱۲۳۴۵۶۷', activeBookings: 3, lastBooking: '۱۴۰۲/۱۲/۱۸', status: 'active' },
    ];
};

export const blockUser = async (userId) => {
    // TODO: اتصال به API واقعی
    console.log(`کاربر ${userId} مسدود شد`);
    return { success: true };
};

export const activateUser = async (userId) => {
    // TODO: اتصال به API واقعی
    console.log(`کاربر ${userId} فعال شد`);
    return { success: true };
};

// ===== مدیریت برگزارکنندگان =====
export const fetchOrganizers = async () => {
    // TODO: اتصال به API واقعی
    return [
        { id: 1, name: 'آکادمی زبان سروش', email: 'info@soroush.ir', eventsCount: 5, totalBookings: 42, status: 'active' },
        { id: 2, name: 'موسسه ریاضیات گسسته', email: 'info@riazi.ir', eventsCount: 3, totalBookings: 28, status: 'active' },
        { id: 3, name: 'کارگاه رایتینگ آیلتس', email: 'info@ielts.ir', eventsCount: 2, totalBookings: 15, status: 'blocked' },
    ];
};

export const blockOrganizer = async (organizerId) => {
    // TODO: اتصال به API واقعی
    console.log(`برگزارکننده ${organizerId} مسدود شد`);
    return { success: true };
};

export const activateOrganizer = async (organizerId) => {
    // TODO: اتصال به API واقعی
    console.log(`برگزارکننده ${organizerId} فعال شد`);
    return { success: true };
};

// ===== مدیریت رویدادها =====
export const fetchEvents = async () => {
    // TODO: اتصال به API واقعی
    return [
        { id: 1, name: 'کارگاه مکالمه', organizer: 'آکادمی زبان سروش', registrations: 8, capacity: 10, status: 'near_full' },
        { id: 2, name: 'دوره گرامر پیشرفته', organizer: 'آکادمی زبان سروش', registrations: 5, capacity: 8, status: 'active' },
        { id: 3, name: 'کارگاه رایتینگ آیلتس', organizer: 'کارگاه رایتینگ آیلتس', registrations: 12, capacity: 15, status: 'active' },
        { id: 4, name: 'تست تعیین سطح', organizer: 'موسسه ریاضیات گسسته', registrations: 25, capacity: 30, status: 'near_full' },
    ];
};
