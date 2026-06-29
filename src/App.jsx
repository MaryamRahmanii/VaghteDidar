import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './pages/users/context/user-context';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import OrganizerLayout from './layouts/OrganizerLayout';
import AdminLayout from './layouts/AdminLayout';

// Public & User Pages
import Landing from './pages/landing';
import Login from './pages/auth/login';
import LoginOtp from './pages/auth/login-otp';
import Signup from './pages/auth/signup';
import SignupOtp from './pages/auth/signup-otp';
import Profile from './pages/users/profile';
import EditProfile from './pages/users/edit-profile';
import PublicOrganizerDashboard from './pages/users/public-organizer-dashboard';

// Organizer Pages
import Overview from './pages/organizer/overview';
import Reservations from './pages/organizer/reservations';
import EventList from './pages/organizer/event-list';
import CreateEvent from './pages/organizer/create-event';
import ManageSchedules from './pages/organizer/manage-schedules';
import Notifications from './pages/organizer/notification';
import Settings from './pages/organizer/setting';

// Admin Pages
import Statistics from './pages/admin/statistics';
import UsersList from './pages/admin/users-list';
import OrganizersList from './pages/admin/organizers-list';
import EventMonitoring from './pages/admin/event-monitoring';

import { ThemeProvider } from './contexts/ThemeContext';


const FakeAdmin = () => <div className="p-10 text-center font-bold text-2xl">سلام ادمین! خوش اومدی به پنل خودت.</div>;
const FakeOrganizer = () => <div className="p-10 text-center font-bold text-2xl">سلام برگزارکننده! اینجا داشبورد شماست.</div>;

function App() {
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
  <ThemeProvider>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          
          
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            
           
            <Route path="/organizer/:slug" element={<PublicOrganizerDashboard />} />
            
           
            <Route path="/public-organizer-dashboard" element={<PublicOrganizerDashboard />} />
            <Route path="/admin-dashboard" element={<FakeAdmin />} />
            <Route path="/organizer-dashboard" element={<FakeOrganizer />} />
          </Route>

         
          <Route element={<AuthLayout />}>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/login-otp" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginOtp />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />
            <Route path="/signup-otp" element={isAuthenticated ? <Navigate to="/" replace /> : <SignupOtp />} />
          </Route>

          {/* ===== صفحات برگزارکننده ===== */}
          <Route element={<OrganizerLayout />}>
            <Route path="/organizer/overview" element={<Overview />} />
            <Route path="/organizer/events" element={<EventList />} />
            <Route path="/organizer/events/create" element={<CreateEvent />} />
            <Route path="/organizer/schedules/:eventId" element={<ManageSchedules />} />
            <Route path="/organizer/reservations" element={<Reservations />} />
            <Route path="/organizer/notification" element={<Notifications />} />
            <Route path="/organizer/setting" element={<Settings />} />
          </Route>

          {/* ===== صفحات ادمین (مدیر ارشد) ===== */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/statistics" element={<Statistics />} />
            <Route path="/admin/users" element={<UsersList />} />
            <Route path="/admin/organizers" element={<OrganizersList />} />
            <Route path="/admin/events" element={<EventMonitoring />} />
          </Route>

          
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </UserProvider>
  </ThemeProvider>
  );
}

export default App;