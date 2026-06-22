import { useEffect, useState } from 'react';
import { fetchUsers, blockUser, activateUser } from '../../services/adminService';
import { Link } from 'react-router-dom';

function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        setLoading(true);
        const data = await fetchUsers();
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleBlock = async (id) => {
        if (!window.confirm('آیا از مسدودسازی این کاربر مطمئن هستید؟')) return;
        try {
            await blockUser(id);
            await loadUsers();
            alert('کاربر با موفقیت مسدود شد.');
        } catch (error) {
            alert('خطا در مسدودسازی کاربر.');
        }
    };

    const handleActivate = async (id) => {
        try {
            await activateUser(id);
            await loadUsers();
            alert('کاربر با موفقیت فعال شد.');
        } catch (error) {
            alert('خطا در فعال‌سازی کاربر.');
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-600 dark:text-gray-300">در حال بارگذاری...</div>;

    return (
        <div className="p-4 lg:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">همه کاربران</h1>
                <Link to="/admin/statistics" className="text-blue-600 dark:text-blue-400">بازگشت به داشبورد</Link>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
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
                        {users.map((user) => (
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
                                        <button onClick={() => handleBlock(user.id)} className="text-red-600 dark:text-red-400 hover:text-red-800">مسدود</button>
                                    ) : (
                                        <button onClick={() => handleActivate(user.id)} className="text-green-600 dark:text-green-400 hover:text-green-800">فعال کردن</button>
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

export default UsersList;
