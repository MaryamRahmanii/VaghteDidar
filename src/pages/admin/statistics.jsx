import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { fetchStats, fetchUsers, fetchOrganizers, fetchEvents, blockUser, activateUser, blockOrganizer, activateOrganizer } from '../../services/adminService';

function Statistics() {
    const { darkMode } = useTheme();
    const [stats, setStats] = useState([]);
    const [users, setUsers] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [statsData, usersData, organizersData, eventsData] = await Promise.all([
                fetchStats(),
                fetchUsers(),
                fetchOrganizers(),
                fetchEvents(),
            ]);
            setStats(statsData);
            setUsers(usersData);
            setOrganizers(organizersData);
            setEvents(eventsData);
            setLoading(false);
        };
        loadData();
    }, []);

    const handleBlockUser = async (userId) => {
        if (!window.confirm('آیا از مسدودسازی این کاربر مطمئن هستید؟')) return;
        try {
            await blockUser(userId);
            const updatedUsers = await fetchUsers();
            setUsers(updatedUsers);
            alert('کاربر با موفقیت مسدود شد.');
        } catch (error) {
            alert('خطا در مسدودسازی کاربر. لطفاً مجدداً تلاش کنید.');
        }
    };

    const handleActivateUser = async (userId) => {
        try {
            await activateUser(userId);
            const updatedUsers = await fetchUsers();
            setUsers(updatedUsers);
            alert('کاربر با موفقیت فعال شد.');
        } catch (error) {
            alert('خطا در فعال‌سازی کاربر.');
        }
    };

    const handleBlockOrganizer = async (organizerId) => {
        if (!window.confirm('آیا از مسدودسازی این برگزارکننده مطمئن هستید؟')) return;
        try {
            await blockOrganizer(organizerId);
            const updatedOrganizers = await fetchOrganizers();
            setOrganizers(updatedOrganizers);
            alert('برگزارکننده با موفقیت مسدود شد.');
        } catch (error) {
            alert('خطا در مسدودسازی برگزارکننده.');
        }
    };

    const handleActivateOrganizer = async (organizerId) => {
        try {
            await activateOrganizer(organizerId);
            const updatedOrganizers = await fetchOrganizers();
            setOrganizers(updatedOrganizers);
            alert('برگزارکننده با موفقیت فعال شد.');
        } catch (error) {
            alert('خطا در فعال‌سازی برگزارکننده.');
        }
    };

    // کارت‌های آماری
    const StatsCards = ({ stats }) => {
        if (!stats || stats.length === 0) return null;
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                    </div>
                ))}
            </div>
        );
    };

    // جدول کاربران
    const UsersTable = () => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 overflow-x-auto">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">لیست کاربران</h2>
                <button className="text-blue-600 dark:text-blue-400 text-sm">مشاهده همه</button>
            </div>
            <table className="min-w-full text-right">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">#</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">نام</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">شماره</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">نوبت فعال</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">آخرین نوبت</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">وضعیت</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {users.slice(0, 5).map((user) => (
                        <tr key={user.id} className="border-b dark:border-gray-700">
                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{user.id}</td>
                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{user.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{user.phone}</td>
                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{user.activeBookings}</td>
                            <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{user.lastBooking}</td>
                            <td className="px-4 py-2 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                                    {user.status === 'active' ? 'فعال' : 'مسدود'}
                                </span>
                            </td>
                            <td className="px-4 py-2 text-sm">
                                {user.status === 'active' ? (
                                    <button onClick={() => handleBlockUser(user.id)} className="text-red-600 dark:text-red-400 hover:text-red-800">مسدود</button>
                                ) : (
                                    <button onClick={() => handleActivateUser(user.id)} className="text-green-600 dark:text-green-400 hover:text-green-800">فعال کردن</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // جدول برگزارکنندگان
    const OrganizersTable = () => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 overflow-x-auto">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">لیست برگزارکنندگان</h2>
                <button className="text-blue-600 dark:text-blue-400 text-sm">مشاهده همه</button>
            </div>
            <table className="min-w-full text-right">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">#</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">نام</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">ایمیل</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">تعداد رویداد</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">کل نوبت‌ها</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">وضعیت</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {organizers.slice(0, 5).map((org) => (
                        <tr key={org.id} className="border-b dark:border-gray-700">
                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{org.id}</td>
                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{org.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{org.email}</td>
                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{org.eventsCount}</td>
                            <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{org.totalBookings}</td>
                            <td className="px-4 py-2 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs ${org.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                                    {org.status === 'active' ? 'فعال' : 'مسدود'}
                                </span>
                            </td>
                            <td className="px-4 py-2 text-sm">
                                {org.status === 'active' ? (
                                    <button onClick={() => handleBlockOrganizer(org.id)} className="text-red-600 dark:text-red-400 hover:text-red-800">مسدود</button>
                                ) : (
                                    <button onClick={() => handleActivateOrganizer(org.id)} className="text-green-600 dark:text-green-400 hover:text-green-800">فعال کردن</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // پایش رویدادها
    const EventsMonitor = () => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">رویدادهای فعال</h2>
                <button className="text-blue-600 dark:text-blue-400 text-sm">مشاهده همه</button>
            </div>
            <table className="min-w-full text-right">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">نام رویداد</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">برگزارکننده</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">ثبت‌نام</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">وضعیت</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => {
                        const statusBadge = event.status === 'active' 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : event.status === 'near_full' 
                                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
                        const statusText = event.status === 'active' 
                            ? 'در حال ثبت‌نام' 
                            : event.status === 'near_full' 
                                ? 'نزدیک به اتمام' 
                                : 'نامشخص';
                        return (
                            <tr key={event.id} className="border-b dark:border-gray-700">
                                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{event.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{event.organizer}</td>
                                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{event.registrations} / {event.capacity}</td>
                                <td className="px-4 py-2 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${statusBadge}`}>{statusText}</span>
                                </td>
                                <td className="px-4 py-2 text-sm">
                                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800">جزئیات</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-gray-600 dark:text-gray-300">در حال بارگذاری...</div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">داشبورد مدیریت</h1>
            <StatsCards stats={stats} />
            <UsersTable />
            <OrganizersTable />
            <EventsMonitor />
        </div>
    );
}

export default Statistics;
