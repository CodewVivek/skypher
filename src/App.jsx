import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/Header';
import Register from './Pages/Register';
import LandingPage from './Pages/LandingPage';
import UserRegister from './Pages/UserRegister';
import ProjectDetails from './Pages/ProjectDetails.jsx';
import DashBoard from './Pages/DashBoard.jsx';
import TermsOfService from './Pages/TermsOfService';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import AdminDashboard from './Pages/AdminDashboard';
import Settings from './Components/Settings.jsx';
import Aboutus from './Components/Aboutus.jsx';
import Footer from './Components/Footer.jsx';
import News from './Pages/News.jsx';
import UserProfile from './Pages/UserProfile.jsx';
import Suggestions from './Pages/Suggestions.jsx';

function AppRoutes() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/launchpage';

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeaderFooter && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<DashBoard />} />
          <Route path="/launchpage" element={<LandingPage />} />
          <Route path="/UserRegister" element={<UserRegister />} />
          <Route path="/submit" element={<Register />} />
          <Route path="/launches/:slug" element={<ProjectDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile/:username" element={<UserProfile />} />
          <Route path="/news" element={<News />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/suggestions" element={<Suggestions />} />
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

