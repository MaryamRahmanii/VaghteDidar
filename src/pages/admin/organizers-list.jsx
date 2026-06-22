import { useEffect, useState } from 'react';
import { fetchOrganizers, blockOrganizer, activateOrganizer } from '../../services/adminService';
import { Link } from 'react-router-dom';

function OrganizersList() {
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrganizers = async () => {
        setLoading(true);
        const data = await fetchOrganizers();
        setOrganizers(data);
        setLoading(false);
    };

    useEffect(() => {
        loadOrganizers();
    }, []);

    const handleBlock = async (id) => {
        if (!window.confirm('آیا از مسدودسازی این برگزارکننده مطمئن هستید؟')) return;
        try {
            await blockOrganizer(id);
            await loadOrganizers();
            alert('برگزارکننده با موفقیت مسدود شد.');
        } catch (error) {
            alert('خطا در مسدودسازی برگزارکننده.');
        }
    };

    const handleActivate = async (id) => {
        try {
            await activateOrganizer(id);
            await loadOrganizers();
            alert('برگزارکننده با موفقیت فعال شد.');
        } catch (error) {
            alert('خطا در فعال‌سازی برگزارکننده.');
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-600 dark:text-gray-300">در حال بارگذاری...</div>;

    return (
        <div className="p-4 lg:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">همه برگزارکنندگان</h1>
                <Link to="/admin/statistics" className="text-blue-600 dark:text-blue-400">بازگشت به داشبورد</Link>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
                <table className="min-w-full text-right">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">#</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">نام</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">ایمیل</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">تعداد رویدادها</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">کل نوبت‌ها</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">وضعیت</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-300">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organizers.map((org) => (
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
                                        <button onClick={() => handleBlock(org.id)} className="text-red-600 dark:text-red-400 hover:text-red-800">مسدود</button>
                                    ) : (
                                        <button onClick={() => handleActivate(org.id)} className="text-green-600 dark:text-green-400 hover:text-green-800">فعال کردن</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrganizersList;
