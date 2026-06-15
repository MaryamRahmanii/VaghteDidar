import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from './layouts/AuthLayout';

import Landing from './pages/landing';
import Login from './pages/auth/login';
import LoginOtp from './pages/auth/login-otp';
import Signup from './pages/auth/signup';
import SignupOtp from './pages/auth/signup-otp';
import MainLayout from './layouts/MainLayout';
import Profile from './pages/users/profile';
import PublicOrganizerDashboard from './pages/users/public-organizer-dashboard';
import EditProfile from './pages/users/edit-profile';
import { UserProvider } from './pages/users/context/user-context';

function App() {
  
  const isAuthenticated = false; 

  return (

    <UserProvider>
      <BrowserRouter>
        <Routes>
          
       
          <Route element={<MainLayout />}>
             <Route path="/" element={<Landing />} />
             <Route path="/profile" element={<Profile />} />
             <Route path="/public-organizer-dashboard" element={<PublicOrganizerDashboard />} />
             <Route path="/edit-profile" element={<EditProfile />} />
          </Route>
          
         
          <Route element={<AuthLayout />}>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/login-otp" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginOtp />} />
            
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />
            <Route path="/signup-otp" element={isAuthenticated ? <Navigate to="/" replace /> : <SignupOtp />} />
          </Route>

          
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;