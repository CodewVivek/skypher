import React from 'react';
import Header from './Components/Header';
import Register from './Pages/Register';
import LandingPage from './Pages/LandingPage';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import UserRegister from './Pages/UserRegister';
import DashBoard from './Pages/DashBoard.jsx';
import TermsOfService from './Pages/TermsOfService';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import AdminDashboard from './Pages/AdminDashboard';
import Settings from './Components/Settings.jsx';
import Profile from './Components/Profile.jsx';
import Aboutus from './Components/Aboutus.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Header />
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/UserRegister" element={<UserRegister />} />
            <Route path="/submit" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about-us" element={<Aboutus />} />

            {/* Add more routes here */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
export default App;

