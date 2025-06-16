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

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Header />
          <Routes>
            <Route path="/submit" element={<Register />} />
            <Route path="/UserRegister" element={<UserRegister />} />
            <Route path="/" element={<DashBoard />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Add more routes here */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
export default App;

