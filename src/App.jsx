import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import OrganizerLayout from './layouts/OrganizerLayout'; // <-- جدید

import Landing from './pages/landing';
import Login from './pages/auth/login';
import LoginOtp from './pages/auth/login-otp';
import Signup from './pages/auth/signup';
import SignupOtp from './pages/auth/signup-otp';
import Profile from './pages/users/profile';
import PublicOrganizerDashboard from './pages/users/public-organizer-dashboard';
import EditProfile from './pages/users/edit-profile';
import { UserProvider } from './pages/users/context/user-context';

// ===== صفحات برگزارکننده (۷ صفحه) =====
import Overview from './pages/organizer/overview';
import EventList from './pages/organizer/event-list';
import CreateEvent from './pages/organizer/create-event';
import ManageSchedules from './pages/organizer/manage-schedules';
import Reservations from './pages/organizer/reservations';
import Notifications from './pages/organizer/notifications';
import Settings from './pages/organizer/settings';

function App() {
  const isAuthenticated = false; // موقتاً

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* ===== صفحات عمومی ===== */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/public-organizer-dashboard" element={<PublicOrganizerDashboard />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Route>

          {/* ===== صفحات احراز هویت ===== */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/login-otp" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginOtp />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />
            <Route path="/signup-otp" element={isAuthenticated ? <Navigate to="/" replace /> : <SignupOtp />} />
          </Route>

          {/* ===== صفحات برگزارکننده (جدید) ===== */}
          <Route element={<OrganizerLayout />}>
            <Route path="/organizer/overview" element={<Overview />} />
            <Route path="/organizer/events" element={<EventList />} />
            <Route path="/organizer/events/create" element={<CreateEvent />} />
            <Route path="/organizer/schedules/:eventId" element={<ManageSchedules />} />
            <Route path="/organizer/reservations" element={<Reservations />} />
            <Route path="/organizer/notifications" element={<Notifications />} />
            <Route path="/organizer/settings" element={<Settings />} />
          </Route>

          {/* ===== مسیر پیش‌فرض ===== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
