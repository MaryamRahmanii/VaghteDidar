import { useEffect, useState } from 'react';
import { fetchEvents } from '../../services/adminService';
import { Link } from 'react-router-dom';

function EventMonitoring() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadEvents = async () => {
        setLoading(true);
        const data = await fetchEvents();
        setEvents(data);
        setLoading(false);
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const getStatusBadge = (status) => {
        if (status === 'active')
            return <span className="px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">در حال ثبت‌نام</span>;
        if (status === 'near_full')
            return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">نزدیک به اتمام</span>;
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">نامشخص</span>;
    };

    if (loading) return <div className="p-6 text-center text-gray-600 dark:text-gray-300">در حال بارگذاری...</div>;

    return (
        <div className="p-4 lg:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">همه رویدادها</h1>
                <Link to="/admin/statistics" className="text-blue-600 dark:text-blue-400">بازگشت به داشبورد</Link>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
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
                        {events.map((event) => (
                            <tr key={event.id} className="border-b dark:border-gray-700">
                                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{event.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{event.organizer}</td>
                                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{event.registrations} / {event.capacity}</td>
                                <td className="px-4 py-2 text-sm">{getStatusBadge(event.status)}</td>
                                <td className="px-4 py-2 text-sm">
                                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800">جزئیات</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EventMonitoring;
