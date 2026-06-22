import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import OrganizerLayout from './layouts/OrganizerLayout';
import { UserProvider } from './pages/users/context/user-context';

import Landing from './pages/landing';
import Login from './pages/auth/login';
import LoginOtp from './pages/auth/login-otp';
import Signup from './pages/auth/signup';
import SignupOtp from './pages/auth/signup-otp';
import Profile from './pages/users/profile';
import EditProfile from './pages/users/edit-profile';
import PublicOrganizerDashboard from './pages/users/public-organizer-dashboard';

// صفحات برگزارکننده
import Overview from './pages/organizer/overview';
import Reservations from './pages/organizer/reservations';
import EventList from './pages/organizer/event-list';
import CreateEvent from './pages/organizer/create-event';
import ManageSchedules from './pages/organizer/manage-schedules';
import Notifications from './pages/organizer/notification';
import Settings from './pages/organizer/setting';



function App() {
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* صفحات عمومی */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/public-organizer-dashboard" element={<PublicOrganizerDashboard />} />

              <Route path="/organizer/:slug" element={<PublicOrganizerDashboard />} />
            </Route>

            {/* صفحات احراز هویت */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
              <Route path="/login-otp" element={isAuthenticated ? <Navigate to="/" /> : <LoginOtp />} />
              <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
              <Route path="/signup-otp" element={isAuthenticated ? <Navigate to="/" /> : <SignupOtp />} />
            </Route>

            {/* ===== صفحات برگزارکننده (۷ صفحه) ===== */}
            <Route element={<OrganizerLayout />}>
              <Route path="/organizer/overview" element={<Overview />} />
              <Route path="/organizer/events" element={<EventList />} />
              <Route path="/organizer/events/create" element={<CreateEvent />} />
              <Route path="/organizer/schedules/:eventId" element={<ManageSchedules />} />
              <Route path="/organizer/reservations" element={<Reservations />} />
              <Route path="/organizer/notification" element={<Notifications />} />
              <Route path="/organizer/setting" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
