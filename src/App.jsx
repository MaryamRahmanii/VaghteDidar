import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from './layouts/AuthLayout';

import Landing from './pages/landing';
import Login from './pages/auth/login';
import LoginOtp from './pages/auth/login-otp';
import Signup from './pages/auth/signup';
import SignupOtp from './pages/auth/signup-otp';
import MainLayout from './layouts/MainLayout';
import Profile from './pages/users/profile';

function App() {
  
  const isAuthenticated = false; 

  return (
    <BrowserRouter>
      <Routes>
        
        <Route element={<MainLayout />}>
           <Route path="/" element={<Landing />} />
           <Route path="/profile" element={<Profile />} />
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
  );
}

export default App;